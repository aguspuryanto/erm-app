import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { CONFIGURATION } from '../services/config.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('content') private content: any;
  
  titleText = 'ERM';
  topSegment = 'risk';
  chartTitle = 'Risk Ranking';
  counterActive = 'risk';

  summaryRiskRangking: any = []
  summaryRiskStatus: any = []
  searchText = '';

  segmentRiskMenu: any = [];
  segmentTaskMenu: any = [];
  segmentProjectMenu: any = [];
  segmentApprovalMenu: any = [];

  chartLabels: any = ["Active", "Overdue", "Completed", "Closed", "Inactive"]
  chartData: any = [12, 19, 3, 5, 3]
  storageValue: any = {};

  constructor(
    public commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController
  ) {
    // this.topSegment = "risk";
    this.segmentRiskMenu = CONFIGURATION.segmentRiskMenu;
  }

  ngOnInit() {
    // this.getSummary();
  }

  ionViewDidEnter() {
    // this.segmentRiskMenu = CONFIGURATION.segmentRiskMenu;
    this.getSummary();
  }
  
  async getSummary(){
    this.commonService.removelocalStorageItem('sumaryRisk');
    
    // if(!this.commonService.isEmpty(this.commonService.getlocalStorageObject('sumaryRisk'))) {
    //   const sumaryRisk = this.commonService.getlocalStorageObject('sumaryRisk');
    //   sumaryRisk.then((data: any) => {
    //     console.log(data, 'data');
    //     this.olahData(data);
    //   });
    //   return;

    // } else {

      const sumaryRisk = this.authService.sumaryRisk();
      forkJoin([sumaryRisk]).subscribe(data => {  
        // console.log(data, '59_');
        this.commonService.setlocalStorageObject('sumaryRisk', data);
        this.olahData(data);
      }, (error) => {
        console.log(error);
      });

    // }
  }
  
  rs_control_owner: any = []
  rs_risk_owner: any = []
  rs_cc_risk: any = []

  ss_control_owner: any = []
  ss_risk_owner: any = []
  ss_cc_risk: any = []
  olahData(data){  
    console.log(data[0].data, '68_');
    this.summaryRiskRangking = data[0].data.rank_summary.all_related_risk;
    this.summaryRiskStatus = data[0].data.status_summary.all_related_risk;

    // rank_summary
    this.rs_cc_risk = data[0].data.rank_summary.cc_risk;
    this.rs_risk_owner = data[0].data.rank_summary.risk_owner;
    this.rs_control_owner = data[0].data.rank_summary.control_owner;

    // status_summary
    this.ss_cc_risk = data[0].data.status_summary.cc_risk;
    this.ss_risk_owner = data[0].data.status_summary.risk_owner;
    this.ss_control_owner = data[0].data.status_summary.control_owner;
  }

  async presentAction(title:string,itemButton:any,icon:any) {

   // let icon = ['flash-outline','archive-outline'];
    var buttonsfill = itemButton.map((v,i)=>{
       return {
           text: v,
           role: 'role-'+v,
           icon: icon[i],
           id: 'button-'+i,
           handler:  () => {
             console.log('Action sheet clicked',title);
              if (title=="My Task"){
                // this.handleMyTask(v);
              } else if(title=="Group Task"){
                // this.handleGroupTask(v);
              }

           },
         translucent:true,
           data: i}
    });

    const actionSheet = await this.actionSheetController.create({
      header: title,
      cssClass: 'my-action-class',
      buttons: buttonsfill

    });
    await this.content.scrollByPoint(0, 360, 800);
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();

    console.log('onDidDismiss resolved with role and data', role, data);
    await this.content.scrollToTop(1000);
  }

  async handleInputSearch(event) {
    this.searchText = event.target.value;
    if(this.searchText.length >=3) {
      console.log(this.searchText, '');

      let loading = await this.loadingCtrl.create({
        message: 'Data Loading ...'
      });

      await loading.present();

      let params = {
        start: 0,
        limit: 10,
        jenis: 'getListAdvanced',
        vTitle: 11,
        cmbsearchby: 1,
        txtkey: this.searchText,
        cmbsrcgroup: 0,
        cmbact: 0,
      }

      this.authService.getSelectTasks(params).subscribe((response) => {
        loading.dismiss();
        var newData = JSON.parse(JSON.stringify(response));
        if(response.totalRecord > 0){
          // this.summaryAssignmentTask = newData['data'];
          console.log(newData['data'])
        } else {
          this.commonService.alertErrorResponse('Searching Not Found');
        }
      }, (error) => {
        loading.dismiss();
        console.log('Error: ', error.message)
        this.commonService.alertErrorResponse(error.message);
      });
    }
  }

  async onCancel(event) {
    // this.searchText = event.target.value;
  }

  handleShowAll(){
    console.log(this.counterActive, 'handleShowAll');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        info_type: 'list',
        role: (this.topSegment!='all_related_risk') ? this.topSegment : '',
      }
    };
    this.router.navigate(['/detail'], navigationExtras);
  }

  async handleRiskRangking(item){
    console.log(item, 'handleRiskRangking')
    // if(!item.value || item.value == '0') return;
    if(this.topSegment == 'risk') this.topSegment = 'all_related_risk';

    let params = {
      info_type: 'list',
      role: (this.topSegment!='all_related_risk') ? this.topSegment : '',
      risk_rank: item.title, // Major / Moderate / Minor / Insignificant
      // risk_status: '',
      // search_by: '',
      // search_keyword: '',
    }
    
    this.goPageDetail(item, params);
  }

  async handleRiskStatus(item){
    console.log(item, 'handleRiskStatus')
    // if(!item.value || item.value == '0') return;
    if(this.topSegment == 'risk') this.topSegment = 'all_related_risk';

    let params = {
      info_type: 'list',
      role: (this.topSegment!='all_related_risk') ? this.topSegment : '',
      risk_status: item.id, // 1/ 2/ 3 / 4
      // search_by: '',
      // search_keyword: '',
    }
    
    this.goPageDetail(item, params);
  }

  async goPageDetail(item, params){
    // console.log(params, '342_params');
    let navigationExtras: NavigationExtras = {
      queryParams: params
    };

    this.router.navigate(['/detail'], navigationExtras);
  }

  segmentChanged(ev: any) {
    // console.log('Segment changed:', ev.detail.value);
    this.topSegment = ev.detail.value;
    this.counterActive = ev.detail.value;
    console.log('Segment changed: topSegment=', this.topSegment + ';counterActive=' + this.counterActive);

    if(this.topSegment == 'all_related_risk') {
      this.getSummary();
    }
    if(this.topSegment == 'control_owner') {
      this.summaryRiskRangking = this.rs_control_owner;
      this.summaryRiskStatus = this.ss_control_owner;
    }

    if(this.topSegment == 'risk_owner') {
      this.summaryRiskRangking = this.rs_risk_owner;
      this.summaryRiskStatus = this.ss_risk_owner;
    }

    if(this.topSegment == 'cc_risk') {
      this.summaryRiskRangking = this.rs_cc_risk;
      this.summaryRiskStatus = this.ss_cc_risk;
    }
  }

  convertToColor(item, colorcode=''){
    if(typeof item === 'undefined') return;
    // console.log(item, 'item');
    const colorUndefined = ["Draft", "Pending Approval"];
    if(colorUndefined.includes(item)){
      // document.documentElement.style.setProperty('--ion-color-primary', '#' + colorcode);
    }
    
    const color = this.commonService.convertToColor(item);
    document.documentElement.style.setProperty('--ion-color-' + color, '#' + colorcode);
    return color;
  }

  showNotifications(){
    // Schedule a single notification
  }

  doRefresh(event) {
    setTimeout(() => {
      // this.getSummary();
      event.target.complete();
    }, 2000);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
