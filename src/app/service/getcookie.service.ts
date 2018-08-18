
import { Injectable } from '@angular/core';
import { Cookie} from '../model/cookie';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class GetcookieService {

  constructor(private cookieService: CookieService) { 
    
    
  }
  getcookie():any{
    let cookieInfo: Cookie = new Cookie("ADMIN","ADMIN","ADMIN");
    if (this.cookieService.check('user') && this.cookieService.check('role') && this.cookieService.check('org'))
    {
      cookieInfo = new Cookie(this.cookieService.get('user'),this.cookieService.get('org'),this.cookieService.get('role'));
    }
    else
    {
      console.log("error: no data in cookies defalut user role oragn admin admin admin");
      //this.cookieService.set("user", "admin");
      //this.cookieService.set("role", "ADMIN");
      //this.cookieService.set("org", "--");
      //cookieInfo = new Cookie(this.cookieService.get('user'),this.cookieService.get('org'),this.cookieService.get('role'));
    }
    return cookieInfo;
    
  }
  

}
