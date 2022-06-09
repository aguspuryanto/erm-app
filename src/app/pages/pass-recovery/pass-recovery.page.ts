import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pass-recovery',
  templateUrl: './pass-recovery.page.html',
  styleUrls: ['./pass-recovery.page.scss'],
})
export class PassRecoveryPage implements OnInit {
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  
  credentials: FormGroup;
  
  constructor(
    public commonService: CommonService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    if (this.routerOutlet && this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
    }
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      action: ['2', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
    });
  }

  async resetPass() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.resetPassword(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();       
        console.log(res,'res')
        if(res.success) {
          // this.router.navigateByUrl('/pass-recovery-success', { replaceUrl: true });
          this.router.navigateByUrl(
            this.router.createUrlTree(['/pass-recovery-success'], {queryParams: res})
          );
        } else {
          this.router.navigateByUrl(
            this.router.createUrlTree(['/pass-recovery-fail'], {queryParams: res})
          );
        }
      },
      async (err) => {
        console.log(err,'Error res!')
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: err.statusText,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
 
  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }
  
  get email() {
    return this.credentials.get('email');
  }
  
  get email2() {
    return this.credentials.get('email2');
  }

}
