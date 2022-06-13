import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonRouterOutlet, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { DetailPopoverComponent } from 'src/app/component/detail-popover/detail-popover.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { CONFIGURATION } from 'src/app/services/config.service';
import { DetailCommentPage } from '../detail-comment/detail-comment.page';
import { DetailModalPage } from '../detail-modal/detail-modal.page';

@Component({
  selector: 'app-detail-all',
  templateUrl: './detail-all.page.html',
  styleUrls: ['./detail-all.page.scss'],
})
export class DetailAllPage implements OnInit {

  headerTitle = '';
  topTitle = 'My Assignments';
  recentSearches : any = [];
  task_type = '';
  vTitle: number = CONFIGURATION.listTaskId.assignment;

  params: any = [];
  dataArra: any = [];
  dataArraTot: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    public actionSheetController: ActionSheetController,
    public popoverController: PopoverController,
    public modalController: ModalController,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    this.headerTitle = this.commonService.getTitleApp()
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params, 'params')
      if (params && params.task_type) {
        this.task_type = params.task_type
      }
    });
    
    this.getTaskList();
  }

  ionViewDidEnter() {
    this.headerTitle = this.commonService.getTitleApp();    
    this.getTaskList();
  }

  showNotifications(){
    this.router.navigateByUrl('/notification', { replaceUrl: true });
  }
  

  groupTask: any = [];
  myTask: any = [];
  myAssignments: any = [];
  myRequest: any = [];
  myCCTask: any = [];
  flaggedTask: any = [];
  
  async getTaskList(){
    // let loading = await this.loadingCtrl.create({
    //   message: 'Data Loading ...'
    // });

    // await loading.present();
    fetch("../../assets/data/priorityArray.json").then(res=>res.json()).then(json=>{
      this.recentSearches = json;
    });
  }

  // vTitle: 4 (Group Task), vTitle: 8 (My Task), Title: 11 (My Assignment), vTitle: 3 (My Request),vTitle: 25 (CC Task), vTitle: 15 (Flagged Task)
  getTaskId(){
    console.log(this.task_type, '')
    if(this.task_type === 'request') {
      this.vTitle = CONFIGURATION.listTaskId.request;
      this.topTitle = 'Request';
    }

    if(this.task_type === 'grouptask') {
      this.vTitle = CONFIGURATION.listTaskId.grouptask;
      this.topTitle = 'My Group Tasks';
    }

    if(this.task_type === 'mytask') {
      this.vTitle = CONFIGURATION.listTaskId.mytask;
      this.topTitle = 'My Tasks';
    }
    
    if(this.task_type === 'flaggedtask') {
      this.vTitle = CONFIGURATION.listTaskId.flaggedtask;
      this.topTitle = 'Flagged Task';
    }

    if(this.task_type === 'cctask') {
      this.vTitle = CONFIGURATION.listTaskId.cctask;
      this.topTitle = 'CC Tasks';
    }

    return this.vTitle;
  }

  async detailModal(item){
    const modal = await this.modalController.create({
      component: DetailModalPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { item: item, topTitle: this.topTitle }
    });

    modal.onDidDismiss().then(dataReturned => {
      console.log('Modal dataReturned :' + JSON.stringify(dataReturned));
    });

    return await modal.present();

    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     item: JSON.stringify(item)
    //   }
    // };
    // this.router.navigate(['/detail-modal'], navigationExtras);
  }

  async detailComment(item){
    const modal = await this.modalController.create({
      component: DetailCommentPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { item: item }
    });

    modal.onDidDismiss().then(dataReturned => {
      console.log('DetailCommentPage return :' + JSON.stringify(dataReturned));
    });

    return await modal.present();
  }

  async handleClickFav(item){
    console.log(item,'handleClickFav')
    const i = this.dataArra.findIndex(t => t.track_id === item.track_id);
    this.dataArra[i]['is_flagged'] = !this.dataArra[i]['is_flagged'];

    const formData = {}; //new FormData();
    formData['jenis'] = 'flagTask';
    formData['taskid'] = item.track_id;
    formData['flag'] = (this.dataArra[i]['is_flagged']) ? 'cbown-' + item.us_last : '';

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
    await loading.present();
    
    const updateFormTask = this.authService.dataUpdTaskGET('UpdTask', formData);
    // const getSelectTasks = this.authService.getSelectTasks(this.params);

    forkJoin([updateFormTask])
    .subscribe(data => {
      loading.dismiss();
      console.log(data[0]);
      const result = JSON.parse(data[0])
      if(result.success){
        this.commonService.alertErrorResponse(result.data + ";" + result.msg);
      }
      this.recentSearches = this.dataArra;
    });
  }

  async presentPopover(ev: any, item) {
    const popover = await this.popoverController.create({
      event,
      component: DetailPopoverComponent,
      componentProps: {data:item},
      cssClass: 'my-custom-class',
      translucent: true,
      dismissOnSelect: true
    });
    await popover.present();
  
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async fetchMoreListing(){
    let params = this.params;
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
 
    await loading.present();
    this.authService.getSelectTasks(params).subscribe((response) => {
      loading.dismiss();
      var newData = JSON.parse(JSON.stringify(response));
      if(newData['success']==true){
        this.dataArraTot = newData['totalRecord'];
        for(let i=0; i<newData['data'].length; i++) {
          this.dataArra.push(newData['data'][i]);
        }
      } else {
        // this.commonService.alertErrorResponse(newData['msg']);
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
      this.commonService.alertErrorResponse(error.message);
    });
  }

  doInfinite(event) {
    // console.log(this.params,'params')
    this.params.start += this.params.limit;
    if(this.dataArra.length == this.dataArraTot ) return;
    setTimeout(() => {
      this.fetchMoreListing()
      event.target.complete();
    }, 500);

  }

  convertformatDate(date:string) {
    const newdate = date.match(/\S+/g).splice(0, 3);
    return newdate.join(' ');
    // return this.commonService.formatDate(newdate.join(' '));
  }

  removeLastWord(str) {
    const lastIndexOfSpace = str.lastIndexOf(' ');  
    if (lastIndexOfSpace === -1) {
      return str;
    }  
    return str.substring(0, lastIndexOfSpace);
  }
  
  menuPopover:any = []
  handleOpenmenu(){
    console.log(this.task_type, 'task_type')
    if(this.task_type == 'mytask') {
      console.log(this.myTask, 'myTask')
      this.presentAction('',this.myTask,['document-text','flash','archive','repeat']);
    }

    if(this.task_type == 'grouptask') {
      this.presentAction('',this.groupTask,['document-text','flash','archive','repeat']);
    }

    if(this.task_type == 'request') {
      this.presentAction('',this.myRequest,['document-text','flash','archive','repeat']);
    }

    if(this.task_type == 'assignment') {
      this.presentAction('',this.myAssignments,['document-text','flash','archive','repeat']);
    }

    if(this.task_type == 'cctask') {
      this.presentAction('',this.myCCTask,['document-text','flash','archive','repeat']);
    }

    if(this.task_type == 'flaggedtask') {
      console.log(this.flaggedTask, 'flaggedTask')
      this.presentAction('',this.flaggedTask,['document-text','flash','archive','repeat']);
    }

    // const itemButton = this.menuPopover.reduce(function(acc, item){
    //   if(item.mn_text) acc.push(item.mn_text)
    //   return acc;
    // }, []);
    
    // const itemIcon = this.menuPopover.reduce(function(acc, item){
    //   if(item.mn_icon) acc.push(item.mn_icon)
    //   return acc;
    // }, []);
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

  handlepresentAction(val){
    // 'Create Task', 'My Active Tasks', 'My Archived Tasks', 'Transfer Task'
    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: this.vTitle, //My Active Task
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }

    if (val=="Create Task"){
      this.router.navigateByUrl('/new-task', { replaceUrl: true });
      return;
    }

    if (val=="Transfer Task"){
      this.router.navigateByUrl('/transfer-task', { replaceUrl: true });
      return;
    }

    if (val=="My Active Tasks"){
      params['stsfilter'] = 3
      this.goPageDetail(params);
    }
  }

  storageValue: any = {};
  async goPageDetail(params){
    // console.log(this.commonService.isEmptyObject(item), '713_goPageDetail')
    this.storageValue['title'] = this.topTitle;
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

        const urlwithParams = 'detail/' + this.task_type + '/' + params['stsfilter'];
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

}
