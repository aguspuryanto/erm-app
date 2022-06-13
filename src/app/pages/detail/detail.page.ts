import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonContent, IonRouterOutlet, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { DetailPopoverComponent } from 'src/app/component/detail-popover/detail-popover.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { DetailCommentPage } from '../detail-comment/detail-comment.page';
import { DetailModalPage } from '../detail-modal/detail-modal.page';
import { FilterSearchPage } from '../filter-search/filter-search.page';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @ViewChild(IonContent, {read: IonContent}) content: IonContent;
  
  // searchField: FormControl;
  title: Date;
  
  searchTerm = '';
  recentSearches : any = [];

  params: any = []
  dataArra: any = []
  dataArraTot: number = 0
  topTitle = 'Risk';
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
  
  async getSummary(){
    fetch("../../assets/data/priorityArray.json").then(res=>res.json()).then(json=>{
      this.recentSearches = json;
    });
  };

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

  async filterSearch(){
    const modal = await this.modalController.create({
      component: FilterSearchPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      // mode: 'ios',
      backdropDismiss: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { item: this.searchTerm }
    });

    modal.onDidDismiss().then(data => {
      console.log('FilterSearchPage return :' + JSON.stringify(data));
    });

    return await modal.present();
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
    // console.log(this.task_type, 'task_type')
    this.router.navigateByUrl('/new-task', { replaceUrl: true });
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
