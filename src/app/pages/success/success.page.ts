import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  msg: string = 'Please check your Email to reset your password'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params.msg);
      this.msg = params.msg
    });
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
