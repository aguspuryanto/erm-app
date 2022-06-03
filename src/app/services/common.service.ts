import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { AlertController } from '@ionic/angular';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONFIGURATION } from './config.service';

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

  ObjectToParams(data) {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  }

  async getlocalStorageObject(key: string): Promise<{ value: any }> {
    const ret = await Storage.get({ key });
    return JSON.parse(ret.value);
  }

  async setlocalStorageObject(key: string, value: any) {
    await Storage.set({ key, value: JSON.stringify(value) });
  }

  async removelocalStorageItem(key: string) {
    await Storage.remove({ key });
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

  convertToSlug(Text) {
    return Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  }

  convertToColor(item){
    // console.log(item, 'convertToColor')
    if(item == 'Active') return 'active'
    if(item == 'Overdue') return 'overdue'
    if(item == 'Completed') return 'completed'
    if(item == 'Closed') return 'closed'
    if(item == 'Unassigned') return 'primary'
  }

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
}
