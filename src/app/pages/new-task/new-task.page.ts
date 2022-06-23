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
  userPref: any = []
  intervalCtrlArr: any = [{'d': 'Day(s)', 'm': 'Month(s)', 'y': 'Year(s)'}]

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
      jenis: ['addTask'],
      prid: [''],
      grid: ['', [Validators.required]],
      cmbinterval: ['', [Validators.required]],
      txtduedate: ['', [Validators.required]],
      txtestdate: ['', [Validators.required]],
      txttitle: ['', [Validators.required]],
      txtevent: [''],
      txtcause: [''],
      txtconsequences: [''],
      txtriskcat: [''],
      txtriskowner: [''],
      txtriskcc: [''],
      txtriskimpact: [''],
      txtrisklikelihood: [''],
      control_owner: [''],
      control_desc: [''],
      interval: [''],
      interval_control: [''],
      assist_control_owner: [''],
      // txtdesc: [''],
      txtassignee: [''],
      txtfullname: [''],
      txtcc: [''],
      councode: ['', [Validators.required]],
      compcode: ['', [Validators.required]],
      deptcode: ['', [Validators.required]],
      txtcat: ['', [Validators.required]],
      txtcatname: [''],
      txttopiccode: ['', [Validators.required]],
      txttopic: [''],
      txt_file1: [''],
      txt_file2: [''],
      txt_file3: [''],
      txt_file4: [''],
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
    this.userPref['txtriskowner'] = getTokenArr.us_id;
    // console.log(this.userPref, '96_userPref')
    this.newTaskForm.get('txtriskowner').setValue(getTokenArr.us_id);

    // this.authService.getUserPreferences().subscribe((response) => {
    //   loading.dismiss();
    //   console.log(response, '77_getUserPreferences')
    //   let respArray = response.split('||')
    //   if(respArray[0]=='false') {
    //     // this.commonService.alertErrorResponse(respArray[1]);
    //   } else {
    //     this.userPref['councode'] = respArray[1];
    //     this.userPref['compcode'] = respArray[2];
    //     this.userPref['deptcode'] = respArray[3];
    //     this.userPref['txtcat'] = '';
    //     console.log(this.userPref, '96_userPref')
    //   }

      // this.getTaskId();
      
      const getCountryList = this.authService.getCountryActive();
      // const getCompanyList = this.authService.getCountryCompany({
      //   query: this.userPref.councode || '062'
      // });
      // const getDeptList = this.authService.getDepartment({
      //   query: this.userPref.compcode || '10'
      // });

      forkJoin([getCountryList])
      .subscribe(data => {
        loading.dismiss();
        console.log(data, '124_');
        this.groupArr = data[0]['data']['listOwner'];
        this.countryArr = data[0]['data']['listCountry'];
        this.categoryArr = data[0]['data']['listCategory'];
        this.impactArr = data[0]['data']['listImpact'];
        this.LikelihoodArr = data[0]['data']['listLikelihood'];

        // this.topicArr = JSON.parse(JSON.stringify(data[2].data));
        // this.companyArr = JSON.parse(JSON.stringify(data[4].data));
        // this.deptArr = JSON.parse(JSON.stringify(data[5].data));
      });

    // }, (error) => {
    //   loading.dismiss();
    //   console.log('Error: ', error.message)
    // });
  }

  async getTaskId() {
    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...',
      showBackdrop: true,
    });
 
    await loading.present();
    this.authService.getTaskId().subscribe((response) => {
      loading.dismiss();
      // console.log(response, '39_taskid') //false||Session Expired
      let respArray = response.split('||')
      // console.log(respArray, '68_taskid')
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
    this.newTaskForm.get('prid').setValue(this.currentValue);

    const getTokenArr = await this.authService.getTokenArr();
    const formData = new FormData();
    formData.append('jenis', this.newTaskForm.get('jenis').value);
    formData.append('prid', this.newTaskForm.get('prid').value);
    formData.append('grid', this.newTaskForm.get('grid').value);
    formData.append('cmbinterval', this.newTaskForm.get('cmbinterval').value);
    formData.append('txtduedate', this.newTaskForm.get('txtduedate').value);
    formData.append('txtestdate', this.newTaskForm.get('txtestdate').value);
    formData.append('txttitle', this.newTaskForm.get('txttitle').value);
    // formData.append('txtdesc', this.newTaskForm.get('txtdesc').value);
    formData.append('txtassignee', this.newTaskForm.get('txtassignee').value);
    formData.append('txtfullname', this.newTaskForm.get('txtfullname').value);
    formData.append('txtcc', this.newTaskForm.get('txtcc').value);
    formData.append('councode', this.newTaskForm.get('councode').value);
    formData.append('compcode', this.newTaskForm.get('compcode').value);
    formData.append('deptcode', this.newTaskForm.get('deptcode').value);
    formData.append('txtcat', this.newTaskForm.get('txtcat').value);
    formData.append('txtcatname', this.newTaskForm.get('txtcatname').value);
    formData.append('txttopiccode', this.newTaskForm.get('txttopiccode').value);
    formData.append('txttopic', this.newTaskForm.get('txttopic').value);
    
    formData.append('us_id', getTokenArr.us_id);
    formData.append('token', getTokenArr.token);
    // console.log(formData.entries(), '314_newTaskForm');

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });
 
    await loading.present(); 
    this.authService.postTaskId(formData).subscribe((response) => {
      loading.dismiss();

      try {
        const data = JSON.parse(response)
        console.log(data);        
        if(!data.success){
          this.commonService.alertErrorResponse(data.msg);
        } else {
          this.router.navigateByUrl('/notif-success', { replaceUrl: true });
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
    const txtriskimpact = this.newTaskForm.get('txtriskimpact').value;
    const txtrisklikelihood = ev.target.value; //this.newTaskForm.get('txtrisklikelihood').value;

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
      this.router.navigateByUrl('/task-success', { replaceUrl: true });
    } else {
      this.currentValue++;
      this.slides.slideNext();
    }
  }

}
