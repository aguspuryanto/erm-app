import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FormLogin: FormGroup;
  showPasswordText:any;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.FormLogin = this.fb.group({
      action: ['1', [Validators.required]],
      usid: ['', [Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
 
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.login(this.FormLogin.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }
 
  // Easy access for form fields
  get usid() {
    return this.FormLogin.get('usid');
  }
  
  get pass() {
    return this.FormLogin.get('pass');
  }

  forgotPass(){
    this.router.navigateByUrl('/pass-recovery', { replaceUrl: true });
  }

  contactAdminPage(){
    this.router.navigateByUrl('/contact-admin', { replaceUrl: true });
  }

}
