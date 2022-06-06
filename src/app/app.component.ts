import { Component, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';
import { CommonService } from './services/common.service';
import { Location } from '@angular/common';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  routeURL: string;
  previousUrl: string;
  lastBack = Date.now();

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList < IonRouterOutlet > ;

  constructor(
    public commonService: CommonService,
    private _location: Location,
    private router: Router,
    private platform: Platform,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    private authService: AuthenticationService,
    private network: Network
  ) {
    this.routeURL = this.router.url;
    this.initializeApp();

    // check connection
    // this.checkNetwork();
  }

  ngOnInit() {
    // check connection
    this.checkNetwork();
  }

  ionViewDidEnter() {
    // check connection
    // this.checkNetwork();
  }

  dataRegister:any={}
  initializeApp() {
    this.platform.ready().then(() => {

      document.body.setAttribute('data-theme', 'light');
      document.body.classList.toggle('dark', false);

      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('prev:', event.url);
        this.previousUrl = event.url;
      });

      if (this.platform.is('android')) {
        console.log('android');
      } else if (this.platform.is('ios')) {
        console.log('ios');
      } else {
        //fallback to browser APIs or
        console.log('The platform is not supported');
      }

      this.authService.isAuthenticated.subscribe(state => {
        console.log(state, '45_state')
        if (state) {
          // this.router.navigate(['tabs']);
          const apiMenu = this.authService.getAPIMenu();
          const sumaryTask = this.authService.sumaryTask();
          forkJoin([apiMenu, sumaryTask]).subscribe(data => {  
            // console.log(data, '112_');
            this.commonService.setlocalStorageObject('apimenuData', data);
          }, (error) => {
            console.log(error);
          });
        } else {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              return: 'login'
            }
          };
          // this.router.navigate(['login'], navigationExtras);
        }
      }, (err) => {console.log(err)});

      // this.backButtonEvent();
      App.addListener('backButton', ({ canGoBack }) => {
        if(!canGoBack){
          // App.exitApp();
          this.showExitConfirm();
        } else {
          // window.history.back();
          console.log('Back press handler!');
          if (this._location.isCurrentPathEqualTo('/tabs/tab1')) {
            // Show Exit Alert!
            console.log('Show Exit Alert!');
            if (Date.now() - this.lastBack < 500) {
              this.showExitConfirm();
            } else {
              let toast = this.toastCtrl.create({
                message: 'Press again to exit',
                duration: 2000,
                position: 'bottom'
              }).then(toast => toast.present());
            }
            this.lastBack= Date.now();
            // processNextHandler();
          } else {
            // Navigate to back page
            console.log('Navigate to back page');
            this._location.back();
          }
        }
      });

    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log('Back press handler!');
      if (this._location.isCurrentPathEqualTo('/tabs/tab1')) {
        // Show Exit Alert!
        console.log('Show Exit Alert!');
        if (Date.now() - this.lastBack < 500) {
          this.showExitConfirm();
        } else {
          let toast = this.toastCtrl.create({
            message: 'Press again to exit',
            duration: 2000,
            position: 'bottom'
          }).then(toast => toast.present());
        }
        this.lastBack= Date.now();
        // processNextHandler();
      } else {
        // Navigate to back page
        console.log('Navigate to back page');
        this._location.back();
      }
    });
  }

  async showExitConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: 'Do you want to leave application?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }

  getUserPref(){
    this.authService.getToken().then(resp => {
      console.log(resp.value, '14_resp')
    })
  }

  checkNetwork(){
    this.commonService.appIsOnline$.subscribe(online => {
      if (!online) {
        console.log('network was disconnected :-(');
        this.commonService.alertErrorResponse('network was disconnected :-(');
      }
    });
  }
}
