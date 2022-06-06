import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, IonRouterOutlet, LoadingController, ActionSheetController, PopoverController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { DetailPopoverComponent } from 'src/app/component/detail-popover/detail-popover.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { DetailCommentPage } from '../detail-comment/detail-comment.page';
import { DetailModalPage } from '../detail-modal/detail-modal.page';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.page.html',
  styleUrls: ['./priority.page.scss'],
})
export class PriorityPage implements OnInit {
  @ViewChild(IonContent, {read: IonContent}) content: IonContent;
  
  // searchField: FormControl;
  title: Date;
  
  searchTerm = '';
  recentSearches : any = [];

  params: any = []
  dataArra: any = []
  dataArraTot: number = 0
  topTitle = 'Active Task';
  storageValue: any = {};
  
  task_type = '';

  // The `ion-modal` element reference.
  modal: HTMLElement;

  constructor(
    public commonService: CommonService,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,
    public popoverController: PopoverController
  ) {
    this.title = new Date();
  }

  ngOnInit() {
    // 
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  ionViewDidEnter() {
    // this.fetchMoreListing();
    this.getSummary();
  }

  groupTask: any = [];
  myTask: any = [];
  myAssignments: any = [];
  myRequest: any = [];
  myCCTask: any = [];
  flaggedTask: any = [];
  
  async getSummary(){
    const apiMenu = this.commonService.getlocalStorageObject('apimenuData');
    apiMenu.then((data: any) => {
      // console.log(data, 'data');
      this.olahData(data);
    });
    
    this.getTaskList();
  };

  olahData(data){
    const apiMenuData = data[0];
    const newData = data[1];
    
    if(this.commonService.isEmptyObject(apiMenuData.data)){
      console.log(apiMenuData.msg,'')
      // this.router.navigateByUrl('/login', { replaceUrl: true });
      
    } else {
      // groupTask
      this.groupTask = []
      for(let i=0; i<apiMenuData.data[1].children[0].children.length; i++) {
        this.groupTask.push(apiMenuData.data[1].children[0].children[i].text);
      }

      // myTask
      this.myTask = []
      for(let i=0; i<apiMenuData.data[1].children[1].children.length; i++) {
        this.myTask.push(apiMenuData.data[1].children[1].children[i].text);
      }

      // My Assignments
      this.myAssignments = []
      for(let i=0; i<apiMenuData.data[1].children[2].children.length; i++) {
        this.myAssignments.push(apiMenuData.data[1].children[2].children[i].text);
      }

      // myRequest
      this.myRequest = []
      for(let i=0; i<apiMenuData.data[1].children[3].children.length; i++) {
        this.myRequest.push(apiMenuData.data[1].children[3].children[i].text);
      }

      // CC Tasks
      this.myCCTask = []
      for(let i=0; i<apiMenuData.data[1].children[4].children.length; i++) {
        this.myCCTask.push(apiMenuData.data[1].children[4].children[i].text);
      }

      // Flagged Task
      this.flaggedTask = []
      for(let i=0; i<apiMenuData.data[1].children[5].children.length; i++) {
        this.flaggedTask.push(apiMenuData.data[1].children[5].children[i].text);
      }
    }
  }
  
  async getTaskList(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();

    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: this.getTaskId(),
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }
    
    const taskList = this.authService.getSelectTasks(params);
    forkJoin([taskList]).subscribe(data => {
      loading.dismiss();
      const listArr = JSON.parse(JSON.stringify(data[0].data));
      console.log(listArr, 'listArr');
      this.recentSearches = listArr;
      
    }, (error) => {
      loading.dismiss();
      console.log(error);
      this.commonService.alertErrorResponse(error.message);
    });
  }

  getTaskId(){
    console.log(this.task_type, '')
    if(typeof this.task_type == 'undefined' || this.commonService.isEmpty(this.task_type)) this.task_type = '17';

    return this.task_type;
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

  async detailModal(item){
    const modal = await this.modalController.create({
      component: DetailModalPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { item: item }
    });

    modal.onDidDismiss().then(dataReturned => {
      console.log('Modal dataReturned :' + dataReturned);
    });

    return await modal.present();
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

  showNotifications(){
  }
  
  filterItems(event){
    this.searchTerm = event.target.value;
    console.log('searchTerm :>> ', this.searchTerm);
    if ( this.searchTerm && this.searchTerm.trim() ) {
      this.recentSearches = this.dataArra.filter(t => t.topic?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.recentSearches = this.dataArra
    }
  }

  async handleSubmitSearch(term?: string) {
    if ( term ) {
      this.searchTerm = term;
    }

    console.log('searchTerm :>> ', this.searchTerm);
    if ( this.searchTerm && this.searchTerm.trim() ) {
      if ( !this.recentSearches.includes(this.searchTerm) ) {
        this.recentSearches.push(this.searchTerm);
      }
    }

    this.searchTerm = null; 
    // this.dataArra = this.dataArra.filter(t => t.topic.includes(this.searchTerm));
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

  async onCancel(event) {
    this.recentSearches = this.dataArra
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

    if(this.task_type == 'flaggedtask') {
      this.presentAction('',this.flaggedTask,['document-text','flash','archive','repeat']);
    }
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

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  handlepresentAction(val){
    console.log(val, '374_handlepresentAction')
    // Active Tasks, Archived Tasks, Management Flag, Own Flag, 'Create Task', 'My Active Tasks', 'My Archived Tasks', 'Transfer Task'
    const listAction = [{
      title: 'Active Tasks',
      task_type: this.task_type,
      url: 'detail/' + this.task_type+ '/3',
    }, {
      title: 'Archived Tasks',
      task_type: this.task_type,
      url: 'detail/' + this.task_type+ '/9',
    }, {
      title: 'Management Flag',
      task_type: this.task_type,
      url: '',
    }, {
      title: 'Own Flag',
      task_type: this.task_type,
      url: '',
    }, {
      title: 'Create Task',
      task_type: this.task_type,
      url: '/new-task',
    }, {
      title: 'My Active Tasks',
      task_type: this.task_type,
      url: 'detail/' + this.task_type+ '/3',
    }, {
      title: 'My Archived Tasks',
      task_type: this.task_type,
      url: 'detail/' + this.task_type+ '/9',
    }, {
      title: 'Transfer Task',
      task_type: this.task_type,
      url: '/transfer-task',
    }];

    const arrItem = listAction.filter(t => t.title.includes(val));
    console.log(arrItem, '391_arrItem')
    if (arrItem && arrItem[0].url){
      this.router.navigateByUrl(arrItem[0].url, { replaceUrl: true });
      return;
    }

    if (val=="My Active Tasks"){
      // params['stsfilter'] = 3
      // this.goPageDetail(params);
    }
  }

}
