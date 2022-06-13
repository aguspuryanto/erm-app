import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-success',
  templateUrl: './task-success.page.html',
  styleUrls: ['./task-success.page.scss'],
})
export class TaskSuccessPage implements OnInit {
  textMsg ='New Risk has been registered successfully';
  updateMsg ='Risk data has been updated successfully ';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  back() {
    this.router.navigateByUrl('/tabs', {replaceUrl: true})
  }

}
