import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  title: Date;
  titleText = 'FAST TRACK SYSTEM';
  
  AppName:string;
  PackageName:string;
  VersionCode:string|number;
  VersionNumber:string;

  slideArr = [{
    sname: 'General',
    sicon: 'person-outline',
    scolor: '#F6F5FB'
  }, {
    sname: 'Task',
    sicon: 'clipboard-outline',
    scolor: '#FFF4F4'
  }, {
    sname: 'Delivery',
    sicon: 'notifications-outline',
    scolor: '#F5F9F9'
  }, {
    sname: 'iSMS',
    sicon: 'chatbubble-ellipses-outline',
    scolor: '#F9F5F9'
  }, {
    sname: 'Approval',
    sicon: 'checkmark-circle-outline',
    scolor: '#F9F5F9'
  }, {
    sname: 'Project',
    sicon: 'business-outline',
    scolor: '#F9F5F9'
  }, {
    sname: 'Report',
    sicon: 'reader-outline',
    scolor: '#F9F5F9'
  }];

  timeZoneArr: any = []
  contact: any = []
  usid: string = '';

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  constructor(
    private appVersion: AppVersion,
    public platform: Platform,
    public commonService: CommonService,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.title = new Date();
    this.titleText = this.commonService.getTitleApp();

    this.appVersion.getAppName().then(value => {
      this.AppName = value;
    }).catch(err => {
      alert(err);
    });

    this.appVersion.getVersionCode().then(value => {
      this.VersionCode = value;
    }).catch(err => {
      alert(err);
    });
  }

  ngOnInit() {
    this.getSingleUser();
  }

  async getSingleUser(){
    const getTokenArr = await this.authService.getTokenArr();
    console.log(getTokenArr, '93_getTokenArr')
    if(!getTokenArr.token) {
      // this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...',
      showBackdrop: true,
    });
 
    await loading.present();
    this.authService.getSingleUser().subscribe((response) => {
      loading.dismiss();
      console.log(response, 'getSingleUser')
      let respArray = response.split('||')
      if(respArray[0]=='false') {
        // this.commonService.alertErrorResponse(respArray[1]);
      } else {

        this.contact['us_fullname']   = respArray[1];
        this.contact['us_loginname']   = respArray[2];
        this.contact['us_email']  = respArray[3];
        this.contact['us_address']   = respArray[4];
        this.contact['us_city']   = respArray[5];
        this.contact['us_directmobillephone']  = respArray[9];
        this.contact['role_name']  = respArray[16];
        this.contact['dept_name']   = respArray[17];
        this.contact['timezone']   = respArray[20];
        console.log(this.contact, 'contact')

        // getTimezone
        const getTimezone = this.authService.getTimezone();
        forkJoin([getTimezone]).subscribe(data => {
          console.log(data);
          this.timeZoneArr = JSON.parse(JSON.stringify(data[0].data));
        });
      }

    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
    });
  }
  
  async logout() {
    this.authService.logout().subscribe((response) => {
      console.log(response, '140_logout')
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }, (error) => {
      console.log('Error: ', error.message)
    });
  }

  showNotifications(){
  }

}
