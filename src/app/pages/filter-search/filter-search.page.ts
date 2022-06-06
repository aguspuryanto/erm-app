import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { CONFIGURATION } from 'src/app/services/config.service';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.page.html',
  styleUrls: ['./filter-search.page.scss'],
})
export class FilterSearchPage implements OnInit {

  filterSearch: any = [];
  recentSearches: any;

  constructor(
    public commonService: CommonService,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getTaskList()
  }
  
  listAssignor: any = []
  listAssignee: any = []
  listGroup: any = []
  async getTaskList(){
    this.listGroup = this.getGroupArr();
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    
    const getAssignor = this.authService.getSelectTasks({
      jenis: 'getTaskAssign',
      vTitle: 8,
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      assignsts: 'track_creator',
      filteredby: '-55555',
    });

    // track_assignee
    const getAssignee = this.authService.getSelectTasks({
      jenis: 'getTaskAssign',
      vTitle: 8,
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      assignsts: 'track_assignee',
      filteredby: '-55555',
    });

    forkJoin([getAssignor, getAssignee]).subscribe(data => {
      loading.dismiss();
      console.log(data, '46_');
      this.listAssignor = JSON.parse(JSON.stringify(data[0].data));
      this.listAssignee = JSON.parse(JSON.stringify(data[1].data));
      
    }, (error) => {
      loading.dismiss();
      console.log(error);
      this.commonService.alertErrorResponse(error.message);
    });
  }
  
  getTaskId() {
    throw new Error('Method not implemented.');
  }

  getGroupArr(){
    return CONFIGURATION.listGroupFilter;
  }

  onChangeAssignor(event){
    this.filterSearch = {...this.filterSearch, ...{assignor: event.target.value}}
  }

  onChangeAssignee(event){
    this.filterSearch = {...this.filterSearch, ...{assignee: event.target.value}}
  }

  onChangeGroup(event){
    this.filterSearch = {...this.filterSearch, ...{group: event.target.value}}
  }

  onChangeSearhBy(event){
    this.filterSearch = {...this.filterSearch, ...{searchby: event.target.value}}
  }

  onChangeSearchKey(event){
    this.filterSearch = {...this.filterSearch, ...{searchekey: event.target.value}}
  }

  onChangeStatus(event){
    this.filterSearch = {...this.filterSearch, ...{status: event.target.value}}
  }

  back() {

  }

  closeModal() {
    this.modalController.dismiss(this.filterSearch);
  }

  applyFilter(){
    this.closeModal()
  }

}
