import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, ActionSheetController, LoadingController, ModalController, NavParams, Platform, IonRouterOutlet } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { RiskUpdatePage } from '../risk-update/risk-update.page';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.page.html',
  styleUrls: ['./detail-modal.page.scss'],
})
export class DetailModalPage implements OnInit {
  @ViewChild('content') private content: any;
  
  // The `ion-modal` element reference.
  modal: HTMLElement;
  params:any = []
  item:any = []
  
  menuPopover:any = []
  segmentDetailselected:number = 0;
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
    this.params = this.navParams.get('item');
    console.log(this.params, '44_');
  }

  ionViewDidEnter() {
    this.getListAction()
  }

  async getListAction(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    const sumaryRisk = this.authService.infoRisk(this.params);
    forkJoin([sumaryRisk]).subscribe(data => {
      loading.dismiss();
      console.log(data, '59_');
      this.item = data[0].data[0];
      this.item.residual = data[0].residual;
      this.item.action_plan = data[0].action_plan;
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
    if(ev.detail.value) this.segmentDetailselected = ev.detail.value;
  }

  async handleRiskupdate(item){
    console.log(item, '85_handleRiskupdate');
    const modal = await this.modalController.create({
      component: RiskUpdatePage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl,
      componentProps: { item: item }
    });

    modal.onDidDismiss().then(dataReturned => {
      console.log('DetailCommentPage return :' + JSON.stringify(dataReturned));
    });

    return await modal.present();
  }

  handleOpenmenu(item){
    console.log(item, '87_handleOpenmenu')
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
  }

  handlepresentAction(val){
    console.log(val, '153_handlepresentAction')
  }

  getStatusColor(val){
    // console.log(val, '154_')
    if(this.commonService.isEmpty(val) || val === undefined) {
      return '#FFC409';
    } else {
      if(val == true) return '#3880FF';
      if(val == false) return 'danger';
    }
  }

  getStatusText(val){
    if(this.commonService.isEmpty(val)) {
      return 'PENDING APPROVAL';
    } else {
      if(val == true) return 'APPROVED';
      if(val == false) return 'REJECTED';
    }
  }

}
