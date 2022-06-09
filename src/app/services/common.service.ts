import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { AlertController } from '@ionic/angular';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONFIGURATION } from './config.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  titleText = 'FAST TRACK SYSTEM';
  appIsOnline$: Observable<boolean>;

  constructor(
    public alertController: AlertController
  ) {
    this.initConnectivityMonitoring();
  }

  private initConnectivityMonitoring() {

    if (!window || !navigator || !('onLine' in navigator)) return;

    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))

  }

  isEmpty(param: any) {
    if (param === '' || typeof param === 'undefined' || param === 'null' || param === null || param === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  isEmptyObject(param: any) {
    if (typeof param === 'undefined' || param === 'null' || param === null || param === [] || param === {} || Object.keys(param).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  async alertErrorResponse(messages) {
    const alert = await this.alertController.create({
      header: 'Opps',
      subHeader: '',
      message: messages,
      buttons: ['Dismiss']
    });
      
    await alert.present();
  }

  async setlocalStorage(key: string, value: string) {
    await Storage.set({ key, value });
  }

  async getlocalStorage(key: string): Promise<{ value: any }> {
      return (await Storage.get({ key }));
  }

  async setlocalStorageObject(key: string, value: any) {
      await Storage.set({ key, value: JSON.stringify(value) });
  }

  async getlocalStorageObject(key: string): Promise<{ value: any }> {
      const ret = await Storage.get({ key });
      return JSON.parse(ret.value);
  }


  async removelocalStorageItem(key: string) {
      await Storage.remove({ key });
  }

  async localStorageclear() {
      await Storage.clear();
  }

  ObjectToParams(data) {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  }

  convertToSlug(Text) {
    return Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  }

  convertToColor(item){
    return this.convertToSlug(item)
  }

  // stsfilter = 1 View All, 2 Unassigned, 3 Active, 4 Overdue, 5 Completed, 6 Closed (Active CC Task)
  // stsfilter = 1 View All, 9 Archiver, 8 Canceled (Archieve CC Task)
  // stsfilter = 10 View All, 11 Active, 12 Overdue, 13 Rejected, 14 RMI (CC Request)
  getstsfilter(text) {
    if(text=='Unassigned'){
      return CONFIGURATION.liststsfilter.Unassigned;
    }

    if(text=='Active'){
      return CONFIGURATION.liststsfilter.Active;
    }

    if(text=='Overdue'){
      return CONFIGURATION.liststsfilter.Overdue;
    }

    if(text=='Completed'){
      return CONFIGURATION.liststsfilter.Completed;
    }

    if(text=='Closed'){
      return CONFIGURATION.liststsfilter.Closed;
    }

    if(text=='Archived'){
      return CONFIGURATION.liststsfilter.Archived;
    }

    if(text=='Canceled'){
      return CONFIGURATION.liststsfilter.Canceled;
    }
  }
  
  // 'assign', 'edit', 'cancel', 'update', 'comment', 'notify', 'reassign', 'delremind', 'reopen', 'close', 'archive', 'flag', 'print'
  getMenuIcon(text){
    if(text == 'assign') return 'person-add-outline';
    if(text == 'edit') return 'create-outline';
    if(text == 'cancel') return 'close-circle-outline';
    if(text == 'update') return 'refresh-circle-outline';
    if(text == 'comment') return 'chatbox-ellipses-outline';
    if(text == 'notify') return 'notifications-outline';
    if(text == 'reassign') return 'person-remove-outline';
    if(text == 'delremind') return 'trash-outline';
    if(text == 'reopen') return 'repeat-outline';
    if(text == 'close') return 'close-outline';
    if(text == 'archive') return 'folder-open-outline';
    if(text == 'flag') return 'flag-outline';
    if(text == 'print') return 'print-outline';
  }

  getMenuText(text){
    if(text == 'Delremind') return 'Del Reminder';
    return text;
  }

  getTitleApp(){
    return this.titleText;
  }

  formatDate(date:string) {
    return moment(date,'YYYYMMDD').format('DD MMM YYYY')
  }

  convertformatDate(date:string) {
    const newdate = date.match(/\S+/g).splice(0, 3);
    return newdate.join(' ');
    // return this.commonService.formatDate(newdate.join(' '));
  }

  convertformatDay(date:string) {
    const newdate = date.match(/\S+/g).splice(0, 1);
    return newdate.join(' ');
  }

  isValidJson(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
}
