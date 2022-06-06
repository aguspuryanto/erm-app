import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  summaryTask: any = []
  constructor(
    public commonService: CommonService,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getSummaryTask();
  }

  async getSummaryTask(){
    let params = {
      start: 0,
      limit: 10,
      jenis: 'getTaskList',
      vTitle: 8, //My Active Task
      stsfilter: 1, //View All
      neefilter: '-55555',
      norfilter: '-55555',
      sorfilter: 'track_date DESC',
      groupedby: 0,
      filteredby: '-55555',
    }

    let loading = await this.loadingCtrl.create({
      message: 'Data Loading ...'
    });

    await loading.present();
    this.authService.getSelectTasks(params).subscribe((response) => {
      loading.dismiss();
      var newData = JSON.parse(JSON.stringify(response));
      if(newData['success']==true){
        this.summaryTask = newData['data'];
        // console.log(this.summaryTask, '94')
        
        // const defaultDateArr = this.summaryTask.reduce(function(filtered, option) {
        //   if (option.datelastx) {
        //     filtered.push(moment(option.track_date).format('YYYY-MM-DD'));
        //   }
        //   return filtered;
        // }, []);

        // const defaultDateFilter = defaultDateArr.filter((item,index) => defaultDateArr.indexOf(item) === index);
        // console.log(defaultDateFilter, 'defaultDateFilter')
        // this.defaultDate = defaultDateFilter;
      } else {
        // this.commonService.alertErrorResponse(newData['msg']);
      }
    }, (error) => {
      loading.dismiss();
      console.log('Error: ', error.message)
      this.commonService.alertErrorResponse(error.message);
    });
  }

}
