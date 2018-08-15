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
    else if ("男" == input)
    {
      return "MALE";
    }
    else if ("女" == input)
    {
      return "FEMALE";
    }
    else if ("正常" == input)
    {
      return "NORMAL";
    }
    else if ("冻结" == input)
    {
      return "LOCKED";
    }
    else if ("待审核" == input)
    {
      return "AUDITING";
    }
    else if ("注销" == input)
    {
      return "UNREGISTERED";
    }
    else if ("审核不通过" == input)
    {
      return "AUDIT_NOT_PASS";
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
    else if ("MALE" == input)
    {
      return "男";
    }
    else if ("FEMALE" == input)
    {
      return "女";
    }
    else if ("NORMAL" == input)
    {
      return "正常";
    }
    else if ("LOCKED" == input)
    {
      return "冻结";
    }
    else if ("AUDITING" == input)
    {
      return "待审核";
    }
    else if ("UNREGISTERED" == input || "DEACTIVE" == input)
    {
      return "注销";
    }
    else if ("AUDIT_NOT_PASS" == input)
    {
      return "审核不通过";
    }
    else
    {
      return "未知";
    }
  }
}
