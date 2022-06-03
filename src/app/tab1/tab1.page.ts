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
  @ViewChild("doughnutCanvas", {static: true}) doughnutCanvas: ElementRef;
  @ViewChild('content') private content: any;

  // doughnutChart: Chart;
  showdoughnutCanvas: boolean = false;
  topSegment: any;
  title: Date;
  titleText = 'ERM';

  groupTask: any = []; //'Unassigned','Active','Overdue','Completed','Closed','Archived','Canceled'
  myTask: any = []; //'Create Task','Unassigned','Active','Overdue','Completed','Closed','Archived','Canceled','Transfer Task'
  myRequest: any = []; //'Create Request','Active','Overdue','On Track','Approved','Reviewed','Executed','Rejected','Archived'
  myApproval: any = []; //'Active','Overdue','On Track','Approved','Reviewed','Executed','Rejected','Archived'

  summaryTask: any = []
  summaryAssignmentTask: any = []
  summaryMyTask: any = []
  summaryRequest: any = []
  summaryCcTask: any = []
  summaryFlagged: any = []
  searchText = '';

  segmentRiskMenu: any = [];
  segmentTaskMenu: any = [];
  segmentProjectMenu: any = [];
  segmentApprovalMenu: any = [];

  chartTitle:string = 'Assignment';
  public counterActive: string = 'assignment';

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
    // Chart.register(...registerables, ChartDataLabels);
    this.topSegment = "risk";
    this.title = new Date();
  }

  ngOnInit() {
    // this.getSummary();
  }

  ionViewDidEnter() {
    this.segmentRiskMenu = CONFIGURATION.segmentRiskMenu;
    this.segmentTaskMenu = CONFIGURATION.segmentTaskMenu;
    // console.log(this.segmentTaskMenu, 'segmentTaskMenu')

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
    const apiMenuData = data[0];
    const newData = data[1];
    
    if(this.commonService.isEmptyObject(apiMenuData.data)){
      console.log(apiMenuData.msg,'')
      let navigationExtras: NavigationExtras = {
        queryParams: {
          return: 'login'
        }
      };
      // this.router.navigate(['login'], navigationExtras);
    } else {
      // this.segmentTaskMenu = apiMenuData.data.filter(t => t.text.includes('Task'))[0].children;
      this.segmentProjectMenu = apiMenuData.data.filter(t => t.text.includes('Project'))[0].children;
      this.segmentApprovalMenu = apiMenuData.data.filter(t => t.text.includes('Approval'))[0].children;

      // groupTask
      this.groupTask = []
      for(let i=0; i<apiMenuData.data[1].children[0].children.length; i++) {
        this.groupTask.push(apiMenuData.data[1].children[0].children[i].text);
      }
      console.log(this.groupTask, 'groupTask');

      // myTask
      this.myTask = []
      for(let i=0; i<apiMenuData.data[1].children[1].children.length; i++) {
        this.myTask.push(apiMenuData.data[1].children[1].children[i].text);
      }

      // myRequest
      this.myRequest = []
      for(let i=0; i<apiMenuData.data[1].children[3].children.length; i++) {
        this.myRequest.push(apiMenuData.data[1].children[3].children[i].text);
      }

      // myApproval
      this.myApproval = []
      for(let i=0; i<apiMenuData.data[1].children[1].children.length; i++) {
        this.myApproval.push(apiMenuData.data[1].children[1].children[i].text);
      }
    }

    if(!this.commonService.isEmptyObject(newData.data)){
      this.summaryTask = newData.data;
      this.summaryAssignmentTask = newData.data.filter(t => t.urai.includes('Assignment'));
      this.summaryMyTask = newData.data.filter(t => t.urai.includes('Task'));
      this.summaryRequest = newData.data.filter(t => t.urai.includes('Request'));
      this.summaryFlagged = newData.data.filter(t => t.urai.includes('Flags'));
      this.summaryCcTask = newData.data.filter(t => t.urai.includes('Approval'));

      this.filterData();
      // this.loadAssignment();
      this.loadRiskSummary();
    }
  }

  filterData(){
    // summaryTask
    if (this.summaryTask.length && this.summaryTask.length) {
      this.summaryTask.forEach((item, index) => {
        this.summaryTask[index].urai = item.urai.replace('My ', '').replace(' Assignment', '')
      });
      console.log('summaryTask', this.summaryAssignmentTask);
    }

    // summaryAssignmentTask
    if (this.summaryAssignmentTask.length && this.summaryAssignmentTask.length) {
      this.summaryAssignmentTask.forEach((item, index) => {
        this.summaryAssignmentTask[index].urai = item.urai.replace('My ', '').replace(' Assignment', '')
      });
    }

    // summaryMyTask
    if (this.summaryMyTask.length && this.summaryMyTask.length) {
      this.summaryMyTask.forEach((item, index) => {
        this.summaryMyTask[index].urai = item.urai.replace('My ', '').replace(' Task', '')
      });
    }

    // summaryRequest
    if (this.summaryRequest.length && this.summaryRequest.length) {
      this.summaryRequest.forEach((item, index) => {
        this.summaryRequest[index].urai = item.urai.replace('My ', '').replace(' Request', '')
      });
    }

    // summaryFlagged
    if (this.summaryFlagged.length && this.summaryFlagged.length) {
      this.summaryFlagged.forEach((item, index) => {
        this.summaryFlagged[index].urai = item.urai.replace('My ', '').replace(' Flags', '')
      });
    }

    // summaryCcTask
    if (this.summaryCcTask.length && this.summaryCcTask.length) {
      this.summaryCcTask.forEach((item, index) => {
        this.summaryCcTask[index].urai = item.urai.replace('My ', '').replace(' Approval', '')
      });
    }
  }

  handleTopTask(item){
    // console.log(item, 'handleTopTask')
    if(item.text == 'Assignments') this.loadAssignment();
    if(item.text == 'Group Tasks') this.loadGroupTask();
    if(item.text == 'My Tasks') this.loadMyTask();
    if(item.text == 'Request') this.loadRequestTask();
    if(item.text == 'CC Tasks') this.loadCcTask();
    if(item.text == 'Flagged Task') this.loadFlaggedTask();
  }

  handleShowAll(){
    console.log(this.counterActive, 'handleShowAll');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        task_type: this.counterActive
      }
    };
    this.router.navigate(['/detail-all'], navigationExtras);
  }

  loadRiskSummary(){
    this.chartTitle = 'Risk Rangking';
    this.counterActive = 'risk';
  }

  loadAssignment(){
    this.chartTitle = 'Assignment';
    this.counterActive = 'assignment';

    if(!this.commonService.isEmptyObject(this.summaryAssignmentTask)) {
      this.chartLabels = [];
      this.chartData = [];
      for ( let i=0; i<this.summaryAssignmentTask.length; i++ ) {
        this.chartLabels[i] = this.summaryAssignmentTask[i].urai.replace('My ', '').replace(' Assignment', '');
        this.chartData[i] = this.summaryAssignmentTask[i].value;
      }
    }

    this.loadChart(); // reload chart

  }

  loadGroupTask() {
    this.chartTitle = 'Group Task';
    this.counterActive = 'grouptask';

    this.chartLabels = [];
    this.chartData = [];
    for ( let i=0; i<this.summaryTask.length; i++ ) {
      this.chartLabels[i] = this.summaryTask[i].urai.replace('My ', '').replace(' Assignment', '').replace(' Task', '').replace(' Request', '');
      this.chartData[i] = this.summaryTask[i].value;
    }
    console.log(this.chartTitle, 'chartTitle')
    // console.log(this.chartLabels, '119_chartLabels')
    // console.log(this.chartData, '120_chartData')

    this.loadChart(); // reload chart
    // this.presentAction(this.chartTitle,this.groupTask,['flash','archive']);
  }

  loadMyTask() {
    this.chartTitle = 'My Task';
    this.counterActive = 'mytask';

    this.chartLabels = [];
    this.chartData = [];
    for ( let i=0; i<this.summaryMyTask.length; i++ ) {
      this.chartLabels[i] = this.summaryMyTask[i].urai.replace('My ', '').replace(' Task', '');
      this.chartData[i] = this.summaryMyTask[i].value;
    }
    console.log(this.chartLabels, '119_chartLabels')
    console.log(this.chartData, '120_chartData')

    this.loadChart(); // reload chart
    // this.presentAction(this.chartTitle,this.myTask,['document-text','flash','archive','repeat']);
  }

  loadRequestTask() {
    this.chartTitle = 'Request';
    this.counterActive = 'request';

    this.chartLabels = [];
    this.chartData = [];
    for ( let i=0; i<this.summaryRequest.length; i++ ) {
      this.chartLabels[i] = this.summaryRequest[i].urai.replace('My ', '').replace(' Request', '');
      this.chartData[i] = this.summaryRequest[i].value;
    }
    console.log(this.chartLabels, '119_chartLabels')
    console.log(this.chartData, '120_chartData')

    this.loadChart(); // reload chart
  }

  loadCcTask() {
    this.chartTitle = 'Task';
    this.counterActive = 'cctask';

    this.chartLabels = [];
    this.chartData = [];
    for ( let i=0; i<this.summaryCcTask.length; i++ ) {
      this.chartLabels[i] = this.summaryCcTask[i].urai;
      this.chartData[i] = this.summaryCcTask[i].value;
    }
    console.log(this.chartLabels, '119_chartLabels')
    console.log(this.chartData, '120_chartData')

    this.loadChart(); // reload chart
  }

  loadFlaggedTask() {
    this.chartTitle = 'Flagged';
    this.counterActive = 'flaggedtask';

    this.chartLabels = [];
    this.chartData = [];
    for ( let i=0; i<this.summaryFlagged.length; i++ ) {
      this.chartLabels[i] = this.summaryFlagged[i].urai;
      this.chartData[i] = this.summaryFlagged[i].value;
    }
    console.log(this.chartLabels, '119_chartLabels')
    console.log(this.chartData, '120_chartData')

    this.loadChart(); // reload chart
  }

  loadMyRequest() {
    // this.presentAction(this.chartTitle,this.myRequest,['document-text','flash','archive','repeat']);
  }

  loadChart(){
    console.log(this.showdoughnutCanvas, 'showdoughnutCanvas')
  }

  async getAssignmentsList(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 11,
      stsfilter: 3,
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }

    this.authService.getSelectTasks(params).subscribe((response) => {
      loading.dismiss();
      var newData = JSON.parse(JSON.stringify(response));
      if(newData['success']==true){
        this.summaryAssignmentTask = newData['data'];
        console.log(this.summaryAssignmentTask, '94')
      } else {
        // this.commonService.alertErrorResponse(newData['msg']);
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
      this.commonService.alertErrorResponse(error.message);
    });
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

  // async handleAssignmentTask(item){
  //   console.log(item, 'handleAssignmentTask')
  // }

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

    // stsfilter = 1 View All, 2 Unassigned, 3 Active, 4 Overdue, 5 Completed, 6 Closed (Active CC Task)
    // stsfilter = 1 View All, 9 Archiver, 8 Canceled (Archieve CC Task)
    // stsfilter = 10 View All, 11 Active, 12 Overdue, 13 Rejected, 14 RMI (CC Request)

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

  // handleFlaggedTaskCounter(item){
  //   console.log(item, 'handleFlaggedTaskCounter')
  //   if(!item.value || item.value == '0') return;
  //   // redirect search page
  // }

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
    console.log(this.commonService.isEmptyObject(item), '713_goPageDetail')
    if(this.commonService.isEmptyObject(item)){
      this.storageValue['title'] = item;
    } else {
      this.storageValue['title'] = 'My ' + item.urai + ' Tasks';
    }
    this.storageValue['params'] = params;

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    this.authService.getSelectTasks(params).subscribe((response) => {
      loading.dismiss();
      var newData = JSON.parse(JSON.stringify(response));
      if(newData['success']==true){
        this.storageValue['data'] = newData['data'];
        console.log(this.storageValue, 'storageValue')

        this.commonService.removelocalStorageItem('tempdata');
        this.commonService.setlocalStorageObject('tempdata', this.storageValue)

        const urlwithParams = 'detail/' + this.counterActive + '/' + params['stsfilter'];
        this.router.navigateByUrl(urlwithParams)
      } else {
        this.commonService.alertErrorResponse(newData['msg']);
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
      this.commonService.alertErrorResponse(error.message);
    });
  }

  handleMyApproval(item){
    console.log(item, 'handleMyApproval')
    // redirect search page
  }

  segmentChanged(ev: any) {
    console.log('Segment changed:', ev.detail.value);
    this.topSegment = ev.detail.value

    if(ev.detail.value == 'task') {
      // this.getSummary();
    }

    if(ev.detail.value == 'approval') {
      this.getApprovalSummary();
    }

    if(ev.detail.value == 'project') {
      // project-assignor, project-leader, project-assignee
      // this.getApprovalSummary();
    }
  }

  async getApprovalSummary(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    this.authService.sumaryApprovalTask().subscribe((response) => {
      loading.dismiss();
      var newData = JSON.parse(JSON.stringify(response));
      if(newData['data']){
        this.summaryTask = newData['data'];
        this.summaryRequest = newData['data'].filter(t => t.urai.includes('Request'));

        this.loadRequestTask();
      } else {
        console.log(newData, '77_newData')
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
    });
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
