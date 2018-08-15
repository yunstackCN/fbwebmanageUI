import { Injectable } from '@angular/core';
import { Cookie } from '../model/cookie';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommomService {

  constructor(private http: HttpClient) { }
  getCkheader(cookieInfo:Cookie){
    let httphead = new HttpHeaders({
      'user':`${cookieInfo.userName}`,
      'role':`${cookieInfo.role}`,
      'org' :`${cookieInfo.orgnization}`
    });
    return httphead;
  }
  getHostUrl():any{
    //let url = "http://localhost:4200/fibricBack/";
    /*
    let configUrl = 'assets/config.json';
    this.http.get(configUrl).subscribe((data: any) => console.log('get from config is ' + data.hostUrl));
    */
   let url = "fibricBack/";
    return url;
  }
}
