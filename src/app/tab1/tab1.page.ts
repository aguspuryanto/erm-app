import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
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
  }

  ngOnInit() {
    // this.getSummary();
  }

  ionViewDidEnter() {
    this.segmentRiskMenu = CONFIGURATION.segmentRiskMenu;
    const apiMenu = this.commonService.getlocalStorageObject('apimenuData');
    apiMenu.then((data: any) => {
      console.log(data, 'data');
      this.olahData(data);
    });
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
                this.handleMyTask(v);
              } else if(title=="Group Task"){
                this.handleGroupTask(v);
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
  
  async getSummary(){
    // 
  }
  
  olahData(data){
    // const apiMenuData = data[0];
    // const newData = data[1];
    fetch("../../assets/data/riskranking.json").then(res=>res.json()).then(json=>{
      this.summaryRiskRangking = json['data'];
    });

    fetch("../../assets/data/riskstatus.json").then(res=>res.json()).then(json=>{
      this.summaryRiskStatus = json['data'];
    });
  }

  handleShowAll(){
    console.log(this.counterActive, 'handleShowAll');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        task_type: this.counterActive
      }
    };
    this.router.navigate(['/detail']);
  }

  loadRiskSummary(){
    this.chartTitle = 'Risk Rangking';
    this.counterActive = 'risk';
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

  async handleAssignmentTask(item){
    console.log(item, 'handleAssignmentTask')
    if(!item.value || item.value == '0') return;

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 11,
      stsfilter: 1,
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }
    
    params['stsfilter'] = this.commonService.getstsfilter(item.urai);
    this.goPageDetail(item, params);
  }

  async handleGroupTask(item){
    console.log(item, 'handleGroupTaskCounter')    
    if(!item.value || item.value == '0') return;
    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 8, //My Active Task
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }
    
    params['stsfilter'] = this.commonService.getstsfilter(item.urai);
    if(item.urai=='Management') {
      params['vTitle'] = 15;
      params['stsfilter'] = 1;
    }
    
    if(item.urai=='Own') {
      params['vTitle'] = 17;
      params['stsfilter'] = 1;
    }
    this.goPageDetail(item, params);
  }

  async handleMyTask(item){
    console.log(item, 'handleMyTask');
    if(!item.value || item.value == '0') return;

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 8, //My Active Task
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }
    
    params['stsfilter'] = this.commonService.getstsfilter(item.urai);
    this.goPageDetail(item, params);
  }

  handleRequesTask(item){
    console.log(item, 'handleRequesTask')
    if(!item.value || item.value == '0') return;
    // redirect search page
  }

  handleRequesTaskCounter(item){
    console.log(item, 'handleRequesTaskCounter')
    if(!item.value || item.value == '0') return;
    // redirect search page
  }

  async handleCCTask(item){
    console.log(item, 'handleCCTask')
    if(!item.value || item.value == '0') return;

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 25, //25 = CC Reques
      stsfilter: 10, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }

    // Active
    if(item=='Active'){
      params['stsfilter'] = 3
    }
    
    // params['stsfilter'] = this.commonService.getstsfilter(item);
    this.goPageDetail(item, params);
  }

  handleCCTaskCounter(item){
    console.log(item, 'handleCCTaskCounter')
    if(!item.value || item.value == '0') return;
    // redirect search page
  }

  async handleFlaggedTask(item){
    console.log(item, 'handleFlaggedTask')
    if(!item.value || item.value == '0') return;

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 8, //My Active Task
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }

    // Management
    if(item.urai=='Own'){
      params['vTitle'] = 15
    }

    // Own
    if(item.urai=='Own'){
      params['vTitle'] = 17
    }
    
    // params['stsfilter'] = this.commonService.getstsfilter(item);
    this.goPageDetail(item, params);
  }

  // Handle Popover
  async handleMyRequest(item){
    console.log(item, 'handleMyRequest')

    // Create Task
    if(item=='Create Request'){
      this.router.navigateByUrl('/new-request', { replaceUrl: true });
      return;
    }

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 3, //Approval => My Request
      stsfilter: 10, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }
    
    // params['stsfilter'] = this.commonService.getstsfilter(item);
    this.goPageDetail(item, params);
  }

  async goPageDetail(item, params){
    console.log(params, '342_params');
    this.router.navigate(['/detail']);
    // if(this.commonService.isEmptyObject(item)){
    //   this.storageValue['title'] = item;
    // } else {
    //   this.storageValue['title'] = 'My ' + item.urai + ' Tasks';
    // }
    // this.storageValue['params'] = params;

    // let loading = await this.loadingCtrl.create({
    //   message: 'Data Loading ...'
    // });

    // await loading.present();
    // this.authService.getSelectTasks(params).subscribe((response) => {
    //   loading.dismiss();
    //   var newData = JSON.parse(JSON.stringify(response));
    //   if(newData['success']==true){
    //     this.storageValue['data'] = newData['data'];
    //     console.log(this.storageValue, 'storageValue')

    //     this.commonService.removelocalStorageItem('tempdata');
    //     this.commonService.setlocalStorageObject('tempdata', this.storageValue)

    //     const urlwithParams = 'detail/' + this.counterActive + '/' + params['stsfilter'];
    //     this.router.navigateByUrl(urlwithParams)
    //   } else {
    //     this.commonService.alertErrorResponse(newData['msg']);
    //   }
    // }, (error) => {
    //   loading.dismiss();
    //   console.log('Error: ', error.message)
    //   this.commonService.alertErrorResponse(error.message);
    // });
  }

  handleMyApproval(item){
    console.log(item, 'handleMyApproval')
    // redirect search page
  }

  segmentChanged(ev: any) {
    // console.log('Segment changed:', ev.detail.value);
    this.topSegment = ev.detail.value;
    this.counterActive = ev.detail.value;
    console.log('Segment changed:', this.topSegment + ';' + this.counterActive);
  }

  convertToColor(item){
    return this.commonService.convertToColor(item);
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
