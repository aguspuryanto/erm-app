import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, ActionSheetController, LoadingController, ModalController, NavParams, Platform } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.page.html',
  styleUrls: ['./detail-modal.page.scss'],
})
export class DetailModalPage implements OnInit {
  @ViewChild('content') private content: any;
  
  // The `ion-modal` element reference.
  modal: HTMLElement;
  item:any = []
  
  menuPopover:any = []
  segmentDetailselected = 1;
  segmentDetailMenu: any = ['Risk Approval','Risk Identification','Existing Risk Assessment','Risk Control','Residual Risk Assessment','Risk Action Plan'];

  constructor(
    public commonService: CommonService,
    private authService: AuthenticationService,
    public popoverController: PopoverController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public navParams: NavParams,
    private file: File,
    public platform: Platform,
    private document: DocumentViewer
  ) { }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item, '44_');
  }

  ionViewDidEnter() {
    this.getListAction()
  }

  async getListAction(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    const sumaryRisk = this.authService.infoRisk(this.item);
    forkJoin([sumaryRisk]).subscribe(data => {
      loading.dismiss();
      console.log(data, '59_');
      this.item = data[0].data;
    }, (error) => {
      loading.dismiss();
      console.log(error);
    });
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed:', ev.detail.value);
    // this.segmentDetailselected = ev.detail.value;

  }

  handleOpenmenu(item){
    console.log(item, '111_handleOpenmenu')
    const itemButton = this.menuPopover.reduce(function(acc, item){
      if(item.mn_text) acc.push(item.mn_text)
      return acc;
    }, []);
    
    const itemIcon = this.menuPopover.reduce(function(acc, item){
      if(item.mn_icon) acc.push(item.mn_icon)
      return acc;
    }, []);
    // console.log(itemButton, 'itemButton')

    // this.presentAction(this.topTitle, itemButton, itemIcon);
  }

  async presentAction(title:string,itemButton:any,icon:any) {

    var buttonsfill = itemButton.map((v,i)=>{
      return {
        text: v,
        role: 'role-'+v,
        icon: icon[i],
        id: 'button-'+i,
        handler:  () => {
          console.log('Action sheet clicked',v);
          this.handlepresentAction(v);
        },
        translucent:true,
        data: i
      }
    });

    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-action-class',
      buttons: buttonsfill

    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  convertformatDate(date:string) {
    const newdate = date.match(/\S+/g).splice(0, 3);
    return newdate.join(' ');
    // return this.commonService.formatDate(newdate.join(' '));
  }

  handlepresentAction(val){
    console.log(val, '153_handlepresentAction')
    // 'edit', 'update', 'comment', 'flag', 'print'
    if (val=="edit"){
      this.closeModal();
      this.router.navigate(['/edit-task'], { queryParams: { track_id: this.item.track_id } });
      return;
    }

    if (val=="update"){
      this.closeModal();
      // this.router.navigate(['/edit-task'], { queryParams: { track_id: this.item.track_id } });
      return;
    }

    if (val=="comment"){
      this.closeModal();
      // this.router.navigate(['/detail-comment'], { queryParams: { track_id: this.item.track_id } });
      return;
    }

    if (val=="flag"){
      // this.closeModal();
      // this.router.navigate(['/detail-flag'], { queryParams: { track_id: this.item.track_id } });
      return;
    }

    if (val=="print"){
      this.closeModal();
      const downloadPath = (this.platform.is('android')) ? this.file.externalDataDirectory : this.file.documentsDirectory;
      
      let tid = this.item.track_id;
      this.authService.downloadFile(tid).subscribe((fileBlob: Blob) => {
        console.log(fileBlob, 'fileBlob')
        /** File - @ionic-native/file/ngx */
        this.file.writeFile(downloadPath, tid + ".pdf", fileBlob, {replace: true});
      }, (error) => {
        console.log('345_Error: ', error.message);
        this.commonService.alertErrorResponse(error.message);
      });
    }
  }

}
