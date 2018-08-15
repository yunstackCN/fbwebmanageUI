import { Injectable } from '@angular/core';
import { Cookie } from '../model/cookie';
import { Observable,of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Account } from '../model/account';
import { Modifyaccount } from '../model/modifyaccount';
const httpOptionPost = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }
  // 查询操作员所在组织的账号 /usrmgr/getOrgAccount orgnization
  // 查询用户的账号 /usrmgr/getUserAccount   输入参数：userName=用户名称
  getAccount(cookie:Cookie,hostUrl:string):Observable<Account[]>{

    if ("OPMGR" == cookie.role)
    {
      let url = hostUrl + "/usrmgr/getOrgAccount";
      let options = { params: new HttpParams().set('orgnization', cookie.orgnization) }
      return this.http.get<any>(url, options)
        .pipe(
        tap(() => console.log('getOrgAccount')),
        catchError(this.handleError('getOrgAccount', []))
      );
    }
    else if (cookie.role == "CUSTOMER")
    {
      let url = hostUrl + "/usrmgr/getUserAccount";
      let options = { params: new HttpParams().set('userName', cookie.userName) }
      return this.http.get<any>(url, options)
        .pipe(
        tap(() => console.log('getUserAccount')),
        catchError(this.handleError('getUserAccount', []))
      );
    }
    else{
      console.log('current user no allow see account');
      return of([] as Account[]);
    }
  }
  // 创建账号 post  /usrmgr/addAccount  Account
  addAccount(account:Account, hostUrl:string):Observable<Account>{
    let url = hostUrl + "usrmgr/addAccount";
    account.regTime = new Date().toLocaleDateString();
    return this.http.post<Account>(url, account, httpOptionPost).pipe(
      tap(() => console.log('addAccount')),
      catchError(this.handleError<Account>('addAccount'))
    );
  }
  // 注销账号 post /usrmgr/unregisterAccount  Account
  unregisterAccount(account:Account, hostUrl:string):Observable<Account>{
    let url = hostUrl + "usrmgr/unregisterAccount";
    return this.http.post<Account>(url, account, httpOptionPost).pipe(
      tap(() => console.log('unregisterAccount')),
      catchError(this.handleError<Account>('unregisterAccount'))
    );
  }
  // 冻结账号 解冻账号 POST    /usrmgr/chgAccountLock   List<ModifyAccountStatus>
  chgAccountLock(accountlst:Modifyaccount[], hostUrl:string):Observable<any>{
    let url = hostUrl + "usrmgr/chgAccountLock";
    return this.http.post<Modifyaccount[]>(url, accountlst, httpOptionPost).pipe(
      tap(() => console.log('chgAccountLock')),
      catchError(this.handleError<Modifyaccount[]>('chgAccountLock'))
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
