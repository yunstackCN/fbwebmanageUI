import { Component, OnInit } from '@angular/core';
import { Cookie } from '../model/cookie';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../service/user.service';
import { GetcookieService } from '../service/getcookie.service';
import { AccountService } from '../service/account.service';
import { Account } from '../model/account';
import * as FileSaver from 'file-saver';
import { utils, write, WorkBook, read } from 'xlsx';
import { PaaswrdQuestion } from '../model/paaswrd-question';
import { CommomService } from '../service/commom.service';
import { TranslateService } from '../service/translate.service';
import { Modifyaccount } from '../model/modifyaccount';
import { HttpHandler } from '@angular/common/http';
@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.css']
})
export class AccountManageComponent implements OnInit {

  searchValue:string;
  nameList = [];
  sortName = null;
  sortValue = null;
  listOfSearchName = [];
  searchAddress: string;
  data = [];
  displayData = [ ...this.data ];
  percent = 0;
  cookInfo:Cookie;
  isHidden: boolean = false;
  constructor(private nzMessageService: NzMessageService, private accountService: AccountService, 
    private cks:GetcookieService,private commonService:CommomService,
    private trans:TranslateService) { }

  ngOnInit() {
    this.cookInfo = this.cks.getcookie();
    console.log("cookie is " + JSON.stringify(this.cookInfo));
    this.accountService.getAccount(this.cookInfo,
                                   this.commonService.getHostUrl()).subscribe((accounts)=>
                                                                             {
                                                                              let dt = [];
                                                                              for (let i =0; i < accounts.length; i++)
                                                                              {
                                                                                dt.push({
                                                                                  //id     :accounts[i].id,
                                                                                  accountid   :`${accounts[i].accountid?accounts[i].accountid:'test'}`,
                                                                                  userName   : `${accounts[i].userName}`,
                                                                                  orgnization    : `${accounts[i].orgnization}`,
                                                                                  name: `${accounts[i].name}`,
                                                                                  regTime: `${accounts[i].regTime}`,
                                                                                  status: `${this.trans.convertENtoCN(accounts[i].status)}` ,
                                                                                  addInfo: `${accounts[i].addInfo?accounts[i].addInfo:""}`,
                                                                                })
                                                                              }
                                                                              this.data = dt;
                                                                              this.displayData = [ ...this.data ];
                                                                             console.log("get account is " + JSON.stringify(accounts))});
    /*
    for (let i =0; i<50; i++)
    {
      
      
      //this.accountService.getAllUsers();

      this.data.push({
        id     :i,
        userName   : `user${i}`,
        orgnization    : "cn",
        name: 'account',
        status:'正常',
        addInfo: ''
      })
      
    }
    */
      
    
  }
  

  sort(sort: { key: string, value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    const data = this.data.filter(item => { return item.userName.indexOf(this.searchValue) !== -1});
    this.displayData = data;

  }

  unRegister(accouninfo): void {
    this.nzMessageService.info('确认注销');
    // 注销账号
    let accn: Account = new Account(accouninfo.id,accouninfo.userName,accouninfo.orgnization,accouninfo.name);
    this.accountService.unregisterAccount(accouninfo, this.commonService.getHostUrl()).subscribe(()=>
                                         {
                                          for (let eachAcc of this.displayData) {
                                                if (eachAcc.name == accouninfo.name)
                                                {
                                                  eachAcc.status = "注销";
                                                  console.log("account unregister ")
                                                  break;
                                                }
                                            }
                                         });
  }
  cancelunReg(): void {
    this.nzMessageService.info('取消注销');
  }
  cancelCommit(){
    this.isHidden = false;
  }
  commit(){
    this.isHidden = true;
  }
  addUser(event){
    console.log('event is ' + event.name);
    this.isHidden = false;
    let accountinfo:Account = event
    if (event.addInfo == null)
    {
      accountinfo.addInfo = " ";
    }
    let data = {
      //id          :  event.id,
      accountid   :`${event.accountid?event.accountid:'test'}`,
      userName    :`${event.userName}`,
      orgnization :`${event.orgnization}`,
      name        :`${event.name}`,
      regTime     :`${event.regTime}`,
      status      : `${this.trans.convertENtoCN(event.status)}`,
      addInfo     :`${event.addInfo}`
  };
    this.displayData.push(data);
    this.displayData = [...this.displayData];
  }
  frozen(accontdata){
    let accountlst:Modifyaccount[] = [];
    accountlst.push({
      userName: `${accontdata.userName}`,
      accountName: `${accontdata.name}`,
      status: "LOCKED"   
    });
    this.accountService.chgAccountLock(accountlst,this.commonService.getHostUrl()).subscribe(()=>
       {
        for (let eachAcc of this.displayData) {
          if (eachAcc.name == accontdata.name)
          {
            eachAcc.status = "冻结";
            console.log("account frozen ")
            break;
          }
      }
       });
  }
  unfrozen(accontdata){
    let accountlst:Modifyaccount[] = [];
    accountlst.push({
      userName: `${accontdata.userName}`,
      accountName: `${accontdata.name}`,
      status: "NORMAL"   
    });
    this.accountService.chgAccountLock(accountlst,this.commonService.getHostUrl()).subscribe(()=>
       {
        for (let eachAcc of this.displayData) {
          if (eachAcc.name == accontdata.name)
          {
            eachAcc.status = "正常";
            console.log("account unfrozen ")
            break;
          }
      }
       });
  }
  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    };
    return buf;
  }
  convertJsonToExcel(excelname,jsondata:any):any{
    const ws_name = excelname;
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(jsondata);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    return wbout;
  }
  downloadTemplate(){
    let accountInfoList: Account[] = [];
    accountInfoList.push({userName:"客户名",orgnization:"所在组织",name:"账号名", password:"注意风险", addInfo:"备注"});
    const outputfile = this.convertJsonToExcel('template', accountInfoList);
    FileSaver.saveAs(new Blob([this.s2ab(outputfile)], { type: 'application/octet-stream' }), 'template.xls');
  }
   downloadTable(){
    const outputfile = this.convertJsonToExcel('account', this.displayData);

    FileSaver.saveAs(new Blob([this.s2ab(outputfile)], { type: 'application/octet-stream' }), 'account.xls');
  }
  uploadTable(importfile){
    /*
    for (let i = 0; i < 300; i++)
    {
      componetObj.percent= ((i + 1)*100)/300;
      let j = 0;
      
      
    }*/
    let componetObj = this;
    let j = 1;
    console.log(importfile);
    let reader = new FileReader();
    
    let accontService = this.accountService;
    let cmmService = this.commonService;
    let tran = this.trans;
    let displayData = this.displayData;
    //let displayData = [];
	  reader.onload = function (filerd:any) {
      let data = filerd.target.result;
      let workbook = read(data, {type: 'binary'});
      let sheetNames = workbook.SheetNames; // 工作表名称集合
      let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
      let uploadAccount:Account[] = utils.sheet_to_json(worksheet);
      console.log(JSON.stringify(uploadAccount));
      for (let i = 0; i < uploadAccount.length; i++)
      //for (let i = 0; i < 1000; i++)
      {
          accontService.addAccount(uploadAccount[i],
          //accontService.addAccount(uploadAccount[0],
          cmmService.getHostUrl()).subscribe((accountinfo)=>
          {
              
              j = j + 1;
              if (accountinfo != null)
              {
                componetObj.displayData.push({
                  id          :  accountinfo.id,
                  userName    :`${accountinfo.userName}`,
                  orgnization :`${accountinfo.orgnization}`,
                  name        :`${accountinfo.name}`,
                  regTime     :`${accountinfo.regTime}`,
                  status      : `${tran.convertENtoCN(accountinfo.status)}`,
                  addInfo     :`${accountinfo.addInfo}`
              });
              componetObj.displayData = [...componetObj.displayData];
              }
              else{
                let accnmae = uploadAccount[i].name;
                componetObj.nzMessageService.create("error", `账户 ${accnmae} 注册失败`);
                console.log(" register error", JSON.stringify(uploadAccount[i]));
              }
              componetObj.percent= (j*100)/uploadAccount.length;
              
         })
      }
    };
    reader.readAsBinaryString(importfile.files[0]);
  }
  // 控制导入组件的显示
  visible = false;

  open(): void {
    this.visible = true;
    
  }

  close(): void {
    this.visible = false;
  }
  inputbtndisable=true;
  setBtndisbel(){
    console.log("this.inputbtndisable=false;");
    this.inputbtndisable=false;
  }
  queryUser(){
    this.accountService.getAccount(this.cookInfo,
      this.commonService.getHostUrl()).subscribe((accounts)=>
                                                {
                                                 let dt = [];
                                                 for (let i =0; i < accounts.length; i++)
                                                 {
                                                   dt.push({
                                                     id     :accounts[i].id,
                                                     userName   : `${accounts[i].userName}`,
                                                     orgnization    : `${accounts[i].orgnization}`,
                                                     name: `${accounts[i].name}`,
                                                     regTime: `${accounts[i].regTime}`,
                                                     status: this.trans.convertENtoCN(accounts[i].status),
                                                     addInfo: `${accounts[i].addInfo}`,
                                                   })
                                                 }
                                                 this.data = dt;
                                                 this.displayData = [ ...this.data ];
                                                console.log("get account is " + JSON.stringify(accounts))});
  }
  


}
