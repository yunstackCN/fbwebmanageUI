
import { Injectable } from '@angular/core';
import { Cookie} from '../model/cookie';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class GetcookieService {

  constructor() { }
  getcookie():any{
    let cookieInfo: Cookie  = new Cookie("admin","admin","admin");
    return cookieInfo;
  }
}
