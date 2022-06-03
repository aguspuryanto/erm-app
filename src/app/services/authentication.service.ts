import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { Storage } from '@capacitor/storage';
import { CommonService } from './common.service';
import { CONFIGURATION } from './config.service';

const TOKEN_KEY = CONFIGURATION.TOKEN_KEY;
const DATA_KEY = CONFIGURATION.DATA_KEY;
const API_SITE = CONFIGURATION.apiEndpoint;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  keyOfData: any = [];

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.loadToken();
  }
 
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    const keyOfData = await Storage.get({key: DATA_KEY});
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.keyOfData = JSON.parse(keyOfData.value);
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
 
  login(params): Observable<any> {
    let queryParams = this.commonService.ObjectToParams(params);

    return this.http.post(`${API_SITE}/Login_Update`, queryParams).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }

  // Approval
  sumaryApprovalTask() {
      // this.getToken();
      let params = {
          start: '0',
          query: this.keyOfData || '228',
          xml: decodeURIComponent('workflow-master/summary-approval.xml')
      }
      let queryParams = this.commonService.ObjectToParams(params);
      console.log(queryParams, 'queryParams_sumaryApprovalTask')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getSelectTasks(params: any) {
      // this.getToken();
      // this.getDataTasks('SelectTasks', params);
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;
      console.log(params, '164_params')

      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/SelectTasks?` + queryParams).pipe(
          map((data: any) => {
              // var newJson = JSON.parse(data.replace(/null/g, "").replace(/[()]/g, ""));
              var newJson = JSON.parse(JSON.stringify(data));
              return newJson;
          }),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }
}
