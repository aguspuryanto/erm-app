import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { CategoryModalPage } from '../category-modal/category-modal.page';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {
  @ViewChild('mySlider', { static: true })  slides: IonSlides;
  
  newTaskForm: FormGroup;

  // priorityArr: any = []
  groupArr: any = []
  countryArr: any = []
  companyArr: any = []
  deptArr: any = []
  categoryArr: any = []
  impactArr: any = []
  LikelihoodArr: any = []
  TreatmentArr: any = []
  EffectivenessArr: any = []
  userPref: any = []
  intervalCtrlArr: any = [{'id': 'd', 'name': 'Day(s)'}, {'id': 'm', 'name': 'Month(s)'}, {'id': 'y', 'name': 'Year(s)'}]

  currentValue = 1;
  taskId: string = 'MKTG_SEA_MYS_002';
  topTitle = 'Register New Risk';

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private loadingCtrl: LoadingController,
    public commonService: CommonService,
    private modalCtrl: ModalController,
  ) {
    // this.title = new Date();
  }

  ngOnInit() {
    this.newTaskForm = this.fb.group({
      country: ['', [Validators.required]],
      company: ['', [Validators.required]],
      department: ['', [Validators.required]],
      risk_owner: [''],
      title: ['', [Validators.required]],
      event: [''],
      cause: [''],
      consequence: [''],
      category: [''],
      risk_cc: [''],
      existing_impact: [''],
      existing_likelihood: [''],
      control_owner: [''],
      control_desc: [''],
      interval: [''],
      interval_control: [''],
      assist_control_owner: [''],
      residual_impact: [''],
      residual_likelihood: [''],
      residual_treatment: [''],
      effectiveness: [''],
      // txtcat: ['', [Validators.required]],
      // txtcatname: [''],
    });

    this.getUserPreferences();
  }

  async getUserPreferences(){
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...',
      showBackdrop: true,
    });
 
    await loading.present();

    const getTokenArr = await this.authService.getTokenArr();
    this.userPref['risk_owner'] = getTokenArr.us_id;
    // console.log(this.userPref, '96_userPref')
    this.newTaskForm.get('risk_owner').setValue(getTokenArr.us_id);
      
    const getCountryList = this.authService.getCountryActive();
    forkJoin([getCountryList])
    .subscribe(data => {
      loading.dismiss();
      console.log(data, '101_');
      this.groupArr = data[0]['data']['listOwner'];
      this.countryArr = data[0]['data']['listCountry'];
      this.categoryArr = data[0]['data']['listCategory'];
      this.impactArr = data[0]['data']['listImpact'];
      this.LikelihoodArr = data[0]['data']['listLikelihood'];
      this.TreatmentArr = data[0]['data']['listTreatment'];
      this.EffectivenessArr = data[0]['data']['listEffectiveness'];

      // this.topicArr = JSON.parse(JSON.stringify(data[2].data));
      // this.companyArr = JSON.parse(JSON.stringify(data[4].data));
      // this.deptArr = JSON.parse(JSON.stringify(data[5].data));
    });
  }

  async getTaskId() {
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...',
      showBackdrop: true,
    });
 
    await loading.present();
    this.authService.getTaskId().subscribe((response) => {
      loading.dismiss();
      let respArray = response.split('||')
      if(respArray[0]=='false') {
        // this.commonService.alertErrorResponse(respArray[1]);
      } else {
        this.taskId = respArray[1]
        console.log(this.taskId, 'taskId')
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
    });
  }

  async addTask() {
    const formData = {
      country: this.newTaskForm.get('country').value,
      company: this.newTaskForm.get('company').value,      
      department: this.newTaskForm.get('department').value,
      risk_owner: this.newTaskForm.get('risk_owner').value,
      title: this.newTaskForm.get('title').value,
      event: this.newTaskForm.get('event').value,
      cause: this.newTaskForm.get('cause').value,
      consequence: this.newTaskForm.get('consequence').value,
      category: this.newTaskForm.get('category').value,
      description_category: '',
      risk_cc: this.newTaskForm.get('risk_cc').value,
      existing_impact: this.newTaskForm.get('existing_impact').value,
      existing_likelihood: this.newTaskForm.get('existing_likelihood').value,
      existing_rank: this.risk_rank,
      control_owner: this.newTaskForm.get('control_owner').value,
      control_desc: this.newTaskForm.get('control_desc').value,
      display_control_owner: '',
      interval: this.newTaskForm.get('interval').value,
      interval_control: this.newTaskForm.get('interval_control').value,
      assist_control_owner: this.newTaskForm.get('assist_control_owner').value,
      residual_impact: this.newTaskForm.get('residual_impact').value,
      residual_likelihood: this.newTaskForm.get('residual_likelihood').value,
      residual_rank: this.residu_rank,
      residual_treatment: this.newTaskForm.get('residual_treatment').value,
      effectiveness: this.newTaskForm.get('effectiveness').value,
      description_effectiveness:  '',
    }

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
 
    await loading.present(); 
    this.authService.postTaskId(formData).subscribe((response) => {
      loading.dismiss();

      try {
        const data = JSON.parse(JSON.stringify(response));
        console.log(data, '178_');        
        if(!data['isSuccess']){
          this.commonService.alertErrorResponse(data.message);
        } else {
          // this.router.navigateByUrl('/notif-success', { replaceUrl: true });
          this.router.navigateByUrl('/task-success', { replaceUrl: true });
        }
      } catch (err) {
        console.log('339_Error: ', err.message);
        this.commonService.alertErrorResponse(err.message);
      }

    }, (error) => {
      loading.dismiss();
      console.log('345_Error: ', error.message);
      this.commonService.alertErrorResponse(error.message);
    });
  }
  
  setValue($event: Event): void {
    this.currentValue = parseInt(($event.target as HTMLInputElement).value, 10);
  }

  task_attributes = true;
  task_cc = false;
  task_attch = false;
  showAttr(){
    this.task_attributes = !this.task_attributes;
  }

  showCc(){
    this.task_cc = !this.task_cc;
  }

  showAttach(){
    // this.task_attch = !this.task_attch;
  }

  async onChangeCountry(ev: any){
    console.log(ev.target.value, '')
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
 
    await loading.present(); 
    // companyArr
    this.authService.getCountryCompany({
      query: ev.target.value
    }).subscribe((response) => {
      loading.dismiss();
      console.log(response);
      var newData = JSON.parse(JSON.stringify(response));
      this.companyArr = newData['data'];
    }, (error) => {
      loading.dismiss();
      this.commonService.alertErrorResponse(error.message);
    });
  }

  async onChangecompany(ev: any){
    console.log(ev.target.value, '')
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
 
    await loading.present(); 
    // deptArr
    this.authService.getDepartment({
      query: ev.target.value
    }).subscribe((response) => {
      loading.dismiss();
      console.log(response);
      var newData = JSON.parse(JSON.stringify(response));
      this.deptArr = newData['data'];
    }, (error) => {
      loading.dismiss();
      this.commonService.alertErrorResponse(error.message);
    });
  }

  onChangeRiskOwner(ev: any){
    console.log(ev.target.value, '')
    // let item = this.groupArr.filter(o=>Object.values(o).includes(ev.target.value));
    if(!this.commonService.isEmptyObject(this.groupArr)) {
      let item = this.groupArr.find(x => x.id === 228);
      console.log(item, '297_')
      this.newTaskForm.get('control_owner').setValue(item.name);
    }
  }

  risk_rank = 0;
  async onChangeLikelihood(ev: any){
    console.log(ev.target.value, '')
    const txtriskimpact = this.newTaskForm.get('existing_impact').value;
    const txtrisklikelihood = ev.target.value; //this.newTaskForm.get('txtrisklikelihood').value;

    this.getRiskRank(txtriskimpact, txtrisklikelihood);
  }

  residu_rank = 0;
  async onChangeResLikelihood(ev: any){
    console.log(ev.target.value, '')
    const txtriskimpact = this.newTaskForm.get('residual_impact').value;
    const txtrisklikelihood = ev.target.value; //this.newTaskForm.get('txtrisklikelihood').value;

    this.getRisiduRank(txtriskimpact, txtrisklikelihood);
  }

  async getRiskRank(txtriskimpact, txtrisklikelihood){    
    if(txtriskimpact && txtrisklikelihood) {
      let loading = await this.loadingCtrl.create({
        message: 'Data Loading ...'
      });
   
      await loading.present();
      this.authService.getRangking({
        impact_id: txtriskimpact,
        likelihood_id: txtrisklikelihood
      }).subscribe((response) => {
        loading.dismiss();
        console.log(response);
        var newData = JSON.parse(JSON.stringify(response));
        // this.risk_rank = newData['data'];
        let respArray = newData['data'].split('||')
        this.risk_rank = respArray[0];
      }, (error) => {
        loading.dismiss();
        this.commonService.alertErrorResponse(error.message);
      });
    }
  }

  async getRisiduRank(txtriskimpact, txtrisklikelihood){    
    if(txtriskimpact && txtrisklikelihood) {
      let loading = await this.loadingCtrl.create({
        message: 'Data Loading ...'
      });
   
      await loading.present();
      this.authService.getRangking({
        impact_id: txtriskimpact,
        likelihood_id: txtrisklikelihood
      }).subscribe((response) => {
        loading.dismiss();
        console.log(response);
        var newData = JSON.parse(JSON.stringify(response));
        // this.risk_rank = newData['data'];
        let respArray = newData['data'].split('||')
        this.residu_rank = respArray[0];
      }, (error) => {
        loading.dismiss();
        this.commonService.alertErrorResponse(error.message);
      });
    }
  }

  onChangeControlOwner(ev: any){

  }

  onChangeControlPeriod(ev: any){

  }

  onChangeAssistant(ev: any){

  }

  onChangeCategory(ev: any){
    let item = this.categoryArr.filter(o=>Object.values(o).includes(ev.target.value));
    console.log(item, '325_onChangeCategory')
    if(!this.commonService.isEmptyObject(item)) this.newTaskForm.get('txtcatname').setValue(item[0]['cat_name']);
  }

  onFileChange(event, i) {
    const fieldname = event.target['attributes'].name.value;
    console.log('360_fieldname => ', fieldname);
    console.log('360_fieldid => ', event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const file = (event.target.files[0] as File);
      this.newTaskForm.get(fieldname).setValue(file);
    }
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryModalPage,
      componentProps : {categoryArr: this.categoryArr},
      // cssClass: 'my-custom-class',
      swipeToClose: true,
      showBackdrop: true,
      backdropDismiss: true,
      // presentingElement: this.routerOutlet.nativeEl,
      // breakpoints: [0, 0.3, 0.5, 0.8],
      // initialBreakpoint: 0.5
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // console.log( modelData.data.item, 'Category Data');
        this.newTaskForm.get('txtcat').setValue(modelData.data.item?.cat_id);
        this.newTaskForm.get('txtcatname').setValue(modelData.data.item?.cat_name);
      }
    });

    await modal.present();
  }

  doInfinite(event) {
    console.log('Done');
    event.target.complete();
  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      console.log(index);
      this.currentValue = index+1;
    });
  }

  slidePrev(){
    this.currentValue--;
    this.slides.slidePrev();
  }

  slideNext(){
    if(this.currentValue == 4) {
      // submit
      console.log(this.newTaskForm.value);
      this.addTask();
      // this.router.navigateByUrl('/task-success', { replaceUrl: true });
    } else {
      this.currentValue++;
      this.slides.slideNext();
    }
  }

}
