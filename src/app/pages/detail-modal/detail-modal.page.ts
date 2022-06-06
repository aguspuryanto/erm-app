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

  topTitle:string = 'Assignment';
  myRequest: any = []  
  menuPopover:any = []

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
    this.topTitle = this.navParams.get('topTitle');
    // navigate
    // this.route.queryParams.subscribe(params => {
    //   this.item = JSON.parse(params['item']);
    // });
    // console.log(this.item, 'item')
    this.getListAction()
  }

  ionViewDidEnter() {
    // let yOffset = document.getElementById('alp');
    // this.content.scrollToPoint(0, yOffset - 70, 1000);
  }

  async getListAction(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    
    const getListAction = this.authService.getSelectTasks2({
      taskid: this.item.track_id,
      jenis: 'getListActionMyTask'
    });

    const requests = forkJoin([getListAction]);
    requests.subscribe(data => {
      loading.dismiss();
      console.log(data, '60_getListAction')
      // console.log(data[0].message, 'message')
      if(!data[0].success) {
        this.commonService.alertErrorResponse(data[0].message);

      } else {
        const listActionArr = JSON.parse(JSON.stringify(data[0].data));
        const listAction = listActionArr[0]['listAction'];
        const showAction = listActionArr[0]['show'].split(',');
  
        // get hidden Menu
        var showMenuAction = [];
        listAction.forEach((item, index) => {
          showAction.forEach(show => {
            if(show === showAction[index]) showMenuAction.push(listAction[show]);
          });
        });
        // console.log(showMenuAction, 'showMenuAction');

        // remove
        showMenuAction = showMenuAction.filter(function(f) { return f !== 'flag' })
        console.log(showMenuAction, 'showMenuAction');
  
        // add into menuPopover
        showMenuAction.forEach(text => {
          const name2 = text.charAt(0).toUpperCase() + text.slice(1);
          if (this.menuPopover.filter(item=> item.mn_text == text).length == 0){
            this.menuPopover.push({ 
              mn_icon: this.commonService.getMenuIcon(text),
              mn_text: text,
              mn_name: this.commonService.getMenuText(name2)
            });
          }
        });
      }

    }, (error) => {
      loading.dismiss();
      console.log(error);
      this.commonService.alertErrorResponse(error.message);
    });
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
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

    this.presentAction(this.topTitle, itemButton, itemIcon);
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
