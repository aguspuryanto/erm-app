import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-success',
  templateUrl: './task-success.page.html',
  styleUrls: ['./task-success.page.scss'],
})
export class TaskSuccessPage implements OnInit {

  textMsg ='New Task has been created successfully';
  constructor() { }

  ngOnInit() {
  }

  back() {
    // this.router.navigateByUrl('/e-clinic/vaccination', {replaceUrl: true})
  }

}
