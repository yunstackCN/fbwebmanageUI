import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../model/user';
import { PaaswrdQuestion } from '../model/paaswrd-question';
import { UserPassword } from '../model/user-password';
import { Orgnization } from '../model/orgnization';

const httpOptionPost = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }
  // 查询所有数据，注意带cookie头
  getAllUsers(header:any, hostUrl:string):Observable<User[]>{
    let url = hostUrl + "usrmgr/getAll";
    console.log(url);
    let httpOptions = {
      headers: header
    };
    return this.http.get<User[]>(url)
      .pipe(
        tap(() => console.log('get users')),
        catchError(this.handleError('getAllUsers', []))
      );
  }
  // 添加问题
  addQuestion(questionInfo:PaaswrdQuestion, header:any, hostUrl:string):Observable<PaaswrdQuestion>{
    let url = hostUrl + "usrmgr/addQuestion";
    let httpOptions = {
      headers: header
    };
    return this.http.post<PaaswrdQuestion>(url, questionInfo, httpOptionPost)
     .pipe(
      tap(() => console.log('get users')),
      catchError(this.handleError<PaaswrdQuestion>('addQuestion'))
    );
  }
  // 注册用户
  registerUser(userInfo, header:any, hostUrl:string):Observable<User>{
    //let url = hostUrl + "usrmgr/register";
    let url = hostUrl + "usrmgr/addUser";
    let httpOptions = {
      headers: header
    };
    userInfo.status = "NORMAL";
    return this.http.post<User>(url, userInfo, httpOptionPost).pipe(
      tap(() => console.log('registerUser')),
      catchError(this.handleError<User>('registerUser'))
    );
  }
  // 修改用户密码
  modifyPassword(userpassworld:UserPassword, hostUrl:string):Observable<any>{
    let url = hostUrl + "/usrmgr/modifyPassword";
    return this.http.post<UserPassword>(url, userpassworld, httpOptionPost).pipe(
      tap(() => console.log('modifyPassword')),
      catchError(this.handleError<User>('modifyPassword'))
    );
  }
  // 注销用户，用get ?name=用户名
  unRegister(name, hostUrl:string):Observable<any>{
    let url = hostUrl + "/usrmgr/unregister";
    let options = { params: new HttpParams().set('name', name) }
    return this.http.get<any>(url, options)
      .pipe(
        tap(() => console.log('unRegister')),
        catchError(this.handleError('unRegister', []))
      );
  }
  // 查询所有组织  /usrmgr/getAllOrg
  getAllOrg(hostUrl:string):Observable<Orgnization[]>{
    let url = hostUrl + "/usrmgr/getAllOrg";
    return this.http.get<Orgnization[]>(url)
      .pipe(
        tap(() => console.log('get getAllOrg')),
        catchError(this.handleError('getAllOrg', []))
      );
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
