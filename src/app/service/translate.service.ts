import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }
  convertCNtoEN(input:string):string{
    if ("系统管理员" == input)
    {
      return "ADMIN";
    }
    else if ("组织管理员" == input)
    {
      return "ORGMGR";
    }
    else if ("操作管理员" == input)
    {
      return "OPMGR";
    }
    else if ("客户" == input)
    {
      return "CUSTOMER";
    }
    else if ("男")
    {
      return "MALE";
    }
    else if ("女")
    {
      return "FEMALE";
    }
    else if ("正常")
    {
      return "NORMAL";
    }
    else if ("冻结")
    {
      return "LOCKED";
    }
    else if ("待审核")
    {
      return "AUDITING";
    }
    else if ("注销")
    {
      return "UNREGISTERED";
    }
    else
    {
      return "unknown";
    }
  }
  convertENtoCN(input:string):string{
    if ("ADMIN" == input)
    {
      return "系统管理员";
    }
    else if ("ORGMGR" == input)
    {
      return "组织管理员";
    }
    else if ("OPMGR" == input)
    {
      return "操作管理员";
    }
    else if ("CUSTOMER" == input)
    {
      return "客户";
    }
    else if ("MALE")
    {
      return "男";
    }
    else if ("FEMALE")
    {
      return "女";
    }
    else if ("NORMAL")
    {
      return "正常";
    }
    else if ("LOCKED")
    {
      return "冻结";
    }
    else if ("AUDITING")
    {
      return "待审核";
    }
    else if ("UNREGISTERED")
    {
      return "注销";
    }
    else
    {
      return "未知";
    }
  }
}
