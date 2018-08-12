import { Component, OnInit } from '@angular/core';
import { Cookie } from '../model/cookie';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../service/user.service';
import { GetcookieService } from '../service/getcookie.service';
import { AccountService } from '../service/account.service';
import { Account } from '../model/account';
import * as FileSaver from 'file-saver';
import { utils, write, WorkBook, read } from 'xlsx';
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

  cookInfo:Cookie;
  isHidden: boolean = false;
  constructor(private nzMessageService: NzMessageService, private accountService: AccountService, private cks:GetcookieService) { }

  ngOnInit() {
    for (let i =0; i<50; i++)
    {
      this.cookInfo = this.cks.getcookie();
      //this.accountService.getAllUsers();

      this.data.push({
        id     :i,
        userName   : `user${i}`,
        orgnization    : "cn",
        name: 'account',
        status:'正常',
        addInfo: ''
      })
      this.nameList.push(
        { text: `user${i}`, value: `user${i}` });
    }
    this.displayData = [ ...this.data ];
    

  ;
    
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

  unRegister(): void {
    this.nzMessageService.info('确认注销');
    // 注销账号
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
    let accountinfo:Account = event;
    this.data.push({
        id          :`${accountinfo.id}`,
        userName    :`${accountinfo.userName}`,
        orgnization :`${accountinfo.orgnization}`,
        name        :`${accountinfo.name}`,
        status      :`${accountinfo.status}`,
        addInfo     :`${accountinfo.addInfo}`
    });
  }
  frozen(accontdata){

  }
  unfrozen(accontdata){

  }
  downloadTable(){
    const ws_name = 'account';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(this.displayData);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      };
      return buf;
    }

    FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'exported.xls');
  }
  uploadTable(importfile){
    console.log(importfile);
    let reader = new FileReader();
	  reader.onload = function(filerd:any) {
		let data = filerd.target.result;
		let workbook = read(data, {type: 'binary'});
		let sheetNames = workbook.SheetNames; // 工作表名称集合
	  let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
    let testJson = utils.sheet_to_json(worksheet);
    //console.log(JSON.stringify(testJson));
    
    
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

}
