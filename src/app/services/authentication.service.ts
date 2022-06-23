import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap, timeout } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';

import { Storage } from '@capacitor/storage';
import { CommonService } from './common.service';
import { CONFIGURATION } from './config.service';
import axios from 'axios';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = CONFIGURATION.TOKEN_KEY;
const DATA_KEY = CONFIGURATION.DATA_KEY;
const API_SITE = CONFIGURATION.apiEndpoint;
const WEBAPI_SITE = CONFIGURATION.webapiEndpoint;
const RESTAPI = CONFIGURATION.webapiEndpoint + '/restapi';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';
  keyOfData: any = [];

  httpOptions = {
      headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/x-www-form-urlencoded;',
      })
  }

  plt: string;

  constructor(
      private http: HttpClient,
      private commonService: CommonService,
      private platform: Platform,
  ) {
      this.platform.ready().then(() => {
          this.plt = this.platform.is('mobileweb') ? 'web' : this.platform.is('ios') ? 'ios' : 'android';
          this.loadToken();
      });
  }

  async loadToken() {
      const token = await Storage.get({key: TOKEN_KEY});
    //   const keyOfData = await Storage.get({key: DATA_KEY});
    //   console.log('token=' + token.value + ';keyOfData=' + JSON.stringify(keyOfData.value));
      if (token.value) {
          this.isAuthenticated.next(true);
      } else {
          this.isAuthenticated.next(false);
      }
  }

  async getToken() {
      const token = await Storage.get({key: TOKEN_KEY});
      const keyOfData = await Storage.get({key: DATA_KEY});
      if (token && token.value) {
          this.token = token.value;
          this.keyOfData = JSON.parse(keyOfData.value);
      }
      return keyOfData;
  }

  getTokenArr(){
      let params = {
        us_id: this.keyOfData.us_id,
        token: this.token,
      }

      return params
  }

  login(params): Observable<any> {
      // params['token'] = this.token || Math.random();        
      const HttpUploadOptions = {
          headers: new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded"})
      }
      let queryParams = this.commonService.ObjectToParams(params);
      console.log(queryParams, '')
      // Storage.remove({key: DATA_KEY});
      // Storage.remove({key: TOKEN_KEY});
      return this.http.post(`${API_SITE}/Login_Update`, queryParams, HttpUploadOptions).pipe(
          tap(resData => {
              if (resData['success'] == true) {
                  Storage.set({key: DATA_KEY, value: resData.data});
                  Storage.set({key: TOKEN_KEY, value: resData.token});
                  this.isAuthenticated.next(true);
              } else {
                  Storage.remove({key: DATA_KEY});
                  Storage.remove({key: TOKEN_KEY});
                  this.isAuthenticated.next(false);
              }
          })
      )
  }

  resetPassword(params): Observable<any> {
      params['token'] = this.token || Math.random();
      
      const HttpUploadOptions = {
          headers: new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded"})
      }
      let queryParams = this.commonService.ObjectToParams(params);

      return this.http.post(`${API_SITE}/Login_Update`, queryParams, HttpUploadOptions).pipe(
          tap(resData => {
              console.log('tap', resData);
              return resData;
          })
      )
  }

  logout() {
      // this.getToken();
      let params = { usid: this.keyOfData, key: this.token }
      let queryParams = this.commonService.ObjectToParams(params);
      return this.http.get(`${API_SITE}/API_Logout?` + queryParams).pipe(
          tap({
              next: (data) => {
                console.log('next:', data)
                Storage.remove({key: DATA_KEY});
                Storage.remove({key: TOKEN_KEY});
                this.isAuthenticated.next(false);
              },
              error: (error) => console.log(error)
          })
      );
  }

  checkSession(){
      let params = { usid: this.keyOfData, key: this.token }
      let queryParams = this.commonService.ObjectToParams(params);
      return this.http.get(`${API_SITE}/CheckUser?` + queryParams, {responseType: 'text'}).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  public async isLoggedIn() {
      const token = await Storage.get({key: TOKEN_KEY});
      const keyOfData = await Storage.get({key: DATA_KEY});
      console.log(token.value, '154_auth_loadToken');
      if (this.commonService.isEmpty(token.value) || this.commonService.isEmpty(keyOfData.value)
      ) {
          // this.logout();
          return false;
      } else {
          return true
      }
  }

  get(url, load = '') {
      if (load == '') {
          // this.loadingshow();
      }
      return new Promise((resolve, reject) => {
          this.http.get(API_SITE + url).subscribe((data: any) => {
              resolve(data);
              // this.dismissLoading();
          }, (err) => {
              reject(err);
              // this.dismissLoading();
          });
      });
  }

  post(url, post, load = '') {           
      // let headers = new Headers            
      // headers.append('Content-Type', 'application/json');

      if (load == '') {
          // this.loadingshow();
      }

      return new Promise((resolve, reject) => {
          this.http.post(API_SITE + url, JSON.stringify(post))
              .subscribe(res => {
                  resolve(res);
                  // this.dismissLoading();
              }, (err) => {
                  reject(err);
                  // this.dismissLoading();
              });
      });
  }

  getGroupData(): Observable<any> {
    let getGroupList = this.getGroupDatauser();
    let getCountryList = this.getCountryActive();
    let getCompanyList = this.getCountryCompany();
    let getDeptList = this.getDepartment();
    let getCatList = this.getCategory();
    let getTopicList = this.getTopikData();

    return forkJoin([getGroupList, getCountryList, getCompanyList, getDeptList, getCatList, getTopicList]);
  }

  // API_Menu
  getAPIMenu(){
      let params = {
          us_id: this.keyOfData,
          token: this.token
      }
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams_getAPIMenu')

      return this.http.get(`${API_SITE}/API_Menu?` + queryParams).pipe(
          tap({
              next: (data) => {
                  console.log('next:', data)
                  // if (data && data.success == 'false') this.isAuthenticated.next(false);
              },
              error: (error) => console.log(error)
          })
      );
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

  // Pending Project Task
  pendingProjectTask() {
      let params = {
          start: '0',
          query: this.keyOfData,
          xml: decodeURIComponent('workflow-master/summary-pendingprojtask.xml')
      }
      let queryParams = this.commonService.ObjectToParams(params);           
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  // Assignee Project Task
  assigneeProjectTask() {
      // this.getToken();
      let params = {
          start: '0',
          query: this.keyOfData,
          xml: decodeURIComponent('workflow-master/summary-project-assignee.xml'),
          us_id: this.keyOfData,
          token: this.token,
      }
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getCategory(params: any = {}) {
      // this.getToken();
      params['start'] = params.start || '0';
      params['limit'] = params.limit || '10';
      params['xml'] = decodeURIComponent('workflow-master/category-data-active.xml');
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;

      let queryParams = this.commonService.ObjectToParams(params)
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getGroupDatauser(params: any = {}) {
      // this.getToken();
      params['start'] = '0';
      params['query'] = this.keyOfData;
      params['xml'] = decodeURIComponent('workflow-master/task/group-data-user.xml');
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;

      let queryParams = this.commonService.ObjectToParams(params)
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getTopikData(params: any = {}) {
      // this.getToken();
      params['start'] = '0';
      // params['limit'] = '20';
      params['xml'] = decodeURIComponent('workflow-master/task/topic-data-active.xml');
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;

      let queryParams = this.commonService.ObjectToParams(params)
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getTimezone(params: any = {}) {
      params['start'] = '0';
      params['xml'] = decodeURIComponent('workflow-master/timezone-data-active.xml');
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;

      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/DataSource?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => JSON.parse(data.replace(/[()]/g, ""))),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getSearchTasks(params: any) {
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;
      console.log(params, '164_params')
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')
      return this.http.get(`${API_SITE}/SelectTasks?` + queryParams, {responseType: 'text'}).pipe(
          map((data: any) => {
              var newJson = JSON.parse(data.replace(/null/g, "").replace(/[()]/g, ""));
              return newJson;
          }),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getDataTasks(url, params: any) {
      this.dataUpdTaskGET(url, params);
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

  getSelectTasks2(params: any) {
      // this.getToken();
      params['us_id'] = this.keyOfData;
      params['token'] = this.token;
      console.log(params, '164_params')

      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')
      
      return this.http.get(`${API_SITE}/API_Workflow?` + queryParams).pipe(
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

  getTaskId() {
      // this.getToken();
      let params = {
          jenis: 'getTaskID',
          grid: '72',
          us_id: this.keyOfData,
          token: this.token,
      }
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/Select?` + queryParams, {responseType: 'text'}).pipe(
          timeout(5000),
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getUserPreferences() {
      let params = {
          jenis: 'getUserPreferences',
          us_id: this.keyOfData,
          token: this.token,
      }
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/Select?` + queryParams, {responseType: 'text'}).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getSingleUser(){
      let params = {
          jenis: 'getSingleUser',
          us_id: this.keyOfData,
          token: this.token,
      }
      let queryParams = this.commonService.ObjectToParams(params);
      // console.log(queryParams, 'queryParams')

      return this.http.get(`${API_SITE}/Select?` + queryParams, {responseType: 'text'}).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  contactAdmin(params) {
      let headers = new HttpHeaders();
      headers.set('Accept', '*/*');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      let options = {
          headers: headers
      }
      console.log(params, '');
      
      return this.http.post(`${API_SITE}/ContactAdmin`, params, options).pipe(
          tap(resData => {
              console.log('tap', resData);
              return resData;
              // this.isAuthenticated.next(true);
          })
      )
  }

  postTaskId(formData) {
      const HttpUploadOptions = {
          headers: new HttpHeaders({"Content-Type": "multipart/form-data"})
      }

      return this.http.post(`${API_SITE}/UpdTask`, formData, {responseType: 'text'}).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  dataUpdTaskGET(url, formData){
      formData['us_id'] = this.keyOfData;
      formData['token'] = this.token;
      let queryParams = this.commonService.ObjectToParams(formData);

      return this.http.get(`${API_SITE}/${url}?` + queryParams, {responseType: 'text'}).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  dataPost(url, formData){
      formData['us_id'] = this.keyOfData;
      formData['token'] = this.token;

      return this.http.post(`${API_SITE}/` + url, formData).pipe(
          tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
          })
      );
  }

  getRequestId(){
      return axios({
          url: `${API_SITE}/UpdTask`,
          method: 'get'
        }).then(response => {        
          console.log(response);
          return response.data;
        })
  }

  // http://fts.dxn2u.com:8282/workflow2//PrintTask?tid=150829&format=6
  downloadFile(tid){
      let params = { 
          tid: tid,
          format: 6,
          us_id: this.keyOfData,
          token: this.token, }
      let queryParams = this.commonService.ObjectToParams(params);

      return this.http.get(`${API_SITE}/PrintTask?` + queryParams, {
          responseType: 'blob', 
          headers: {
              // 'Authorization': 'Bearer ' + yourTokenIfYouNeed,
          }
      });

      // ).subscribe((fileBlob: Blob) => {
      //     /** File - @ionic-native/file/ngx */
      //     this.file.writeFile(downloadPath, "YourFileName.pdf", fileBlob, {replace: true});
      // }
  }
  
  // AXIOS
  async makeGetRequest(){
      const api = axios.create({baseURL: `${API_SITE}`});
      let params = {
          start: '0',
          query: this.keyOfData || '228',
          xml: decodeURIComponent('workflow-master/summary-task.xml')
      }
      const dataPromise = await api.get('DataSource', { params: params }).then((response) => response.data)
      return dataPromise
  }

  async makePostRequest(url, params){
    const api = axios.create({baseURL: `${API_SITE}`});    
    const dataPromise = api.post(url, params).then((response) => response.data)
    return dataPromise
  }

  async axiosPost(url, formData){
      return await axios.post(`${API_SITE}/` + url, formData)
          .then((response) => {
              console.log(response.data);
      });
  }

  axiosUpdTaskPost(formData){
      const api = axios.create({baseURL: `${API_SITE}`});    
      const dataPromise = api.post('/UpdTask', formData, {
          responseType: 'text',
          headers: {
              "Content-Type": "multipart/form-data",
          },
      }).then((response) => response.data)
      return dataPromise
  }

  webLogin(params) {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${WEBAPI_SITE}/restapi/user/signin`, params).pipe(
        map((data: any) => {
            return data;
        }),
        tap({
            next: (data) => {
                console.log('next:', data.data.authtoken)
                if (data.isSuccess == true) {
                    Storage.set({key: DATA_KEY, value: JSON.stringify(data.data)});
                    Storage.set({key: TOKEN_KEY, value: data.data.authtoken});
                    this.isAuthenticated.next(true);
                } else {
                    Storage.remove({key: DATA_KEY});
                    Storage.remove({key: TOKEN_KEY});
                    this.isAuthenticated.next(false);
                }
            },
            error: (error) => console.log(error)
        })
    )
  }

  // Summary Risk
  sumaryRisk() {
    console.log(this.keyOfData, 'this.keyOfData')
    let params = {
        us_id: this.keyOfData.us_id
    }
    // let queryParams = this.commonService.ObjectToParams(params);

    return this.http.post(`${WEBAPI_SITE}/restapi/risk/summary`, params).pipe(
        map((data: any) => {
            return data;
        }),
        tap({
            next: (data) => console.log('next:', data),
            error: (error) => console.log(error)
        })
    );
  }

    // Detail Risk
    infoRisk(params) {
        let newparams = {...params, ...{ us_id: this.keyOfData.us_id }};
        return this.http.post(`${WEBAPI_SITE}/restapi/risk/risk-info`, newparams).pipe(
            map((data: any) => {
                return data;
            }),
            tap({
                next: (data) => console.log('next:', data),
                error: (error) => console.log(error)
            })
        );
    }

    getCountryActive(params: any = {}) {
        params['us_id'] = this.keyOfData.us_id;
        params['token'] = this.token;  
        let queryParams = this.commonService.ObjectToParams(params);
        // console.log(queryParams, 'queryParams')  
        return this.http.get(`${RESTAPI}/risk/country?` + queryParams).pipe(
            tap({
              next: (data) => console.log('next:', data),
              error: (error) => console.log(error)
            })
        );
    }

    getCountryCompany(params: any = {}) {
        params['us_id'] = this.keyOfData.us_id;
        params['token'] = this.token;  
        let queryParams = this.commonService.ObjectToParams(params)
        // console.log(queryParams, 'queryParams')
  
        return this.http.get(`${RESTAPI}/risk/company?` + queryParams).pipe(
            tap({
                next: (data) => console.log('next:', data),
                error: (error) => console.log(error)
            })
        );
    }

    getDepartment(params: any = {}) {
        // params['query'] = '10';
        // params['us_id'] = this.keyOfData.us_id;
        // params['token'] = this.token;  
        // let queryParams = this.commonService.ObjectToParams(params);
        // console.log(queryParams, 'queryParams')
        let newparams = {...params, ...{ us_id: this.keyOfData.us_id, token: this.token }};
        let queryParams = this.commonService.ObjectToParams(newparams);
        return this.http.get(`${RESTAPI}/risk/department?` + queryParams).pipe(
            tap({
                next: (data) => console.log('next:', data),
                error: (error) => console.log(error)
            })
        );
    }

    getRangking(params: any = {}){
        let newparams = {...params, ...{ us_id: this.keyOfData.us_id, token: this.token }};
        let queryParams = this.commonService.ObjectToParams(newparams);
        return this.http.get(`${RESTAPI}/risk/getranking?` + queryParams).pipe(
            tap({
                next: (data) => console.log('next:', data),
                error: (error) => console.log(error)
            })
        );
    }
}
