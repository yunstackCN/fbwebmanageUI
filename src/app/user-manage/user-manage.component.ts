import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../service/user.service';
import { GetcookieService } from '../service/getcookie.service';
import { Cookie } from '../model/cookie';
import { User } from '../model/user';
import { CommomService } from '../service/commom.service';
import { TranslateService } from '../service/translate.service';
@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
 
  dataSet: Array<{ name: string; sex: string; age:number; orgnization: string; role:string ;status:string; addinfo:string}> = [];
  cookInfo:Cookie;
  isHidden: boolean = false;
  userInfo: User;
  constructor(private nzMessageService: NzMessageService, private userService: UserService, 
         private cks:GetcookieService,private commonService:CommomService, private trans:TranslateService) {
          
         }
  ngOnInit(): void {
    
    
    
    
   this.cookInfo = this.cks.getcookie();
   let url = this.commonService.getHostUrl();
          // 查询所有用户数据，根据角色过滤
          
   this.userService.getAllUsers(this.commonService.getCkheader(this.cookInfo),
                              this.commonService.getHostUrl()).subscribe((users) => 
                                   {
                                    console.log("get all from users" + JSON.stringify(users));
                                       this.updateUiFromSrv(users);
                                      });
    
  }
  updateUiFromSrv(users:User[]){
    // 系统管理员能看到所有用户，组织管理能看到本组织的所有用户，操作管理能看到客户的角色，客户能看到自己
    console.log("get all from users" + JSON.stringify(users));
    if ("ADMIN" == this.cookInfo.role)
    {
      let data = [];
      for (let i = 0;i < users.length; i++)
      {
        data.push({
          name   : `${users[i].name}`,
          sex    : `${this.trans.convertENtoCN(users[i].sex)}`,
          age    : users[i].age,
          orgnization: `${users[i].orgnization}`,
          role : `${this.trans.convertENtoCN(users[i].role)}`,
          status: `${this.trans.convertENtoCN(users[i].status)}`,
          addinfo: `${users[i].addinfo?"":users[i].addinfo }`
        });
      }
      this.dataSet = data;
      console.log(" updateUiFromSrv ADMIN " + JSON.stringify(this.dataSet));
    
      
    }
    else if ("ORGMGR" == this.cookInfo.role)
    {
      let data = [];
      for (let i = 0;i < users.length; i++)
      {
          if (users[i].orgnization != this.cookInfo.orgnization)
          {
            continue;
          }
          data.push({
          name   : `${users[i].name}`,
          sex    : `${this.trans.convertENtoCN(users[i].sex)}`,
          age    : users[i].age,
          orgnization: `${users[i].orgnization}`,
          role : `${this.trans.convertENtoCN(users[i].role)}`,
          status: `${this.trans.convertENtoCN(users[i].status)}`,
          addinfo: `${users[i].addinfo?"":users[i].addinfo }`
        });
      }
      this.dataSet = data;
    }
    else if ("OPMGR" == this.cookInfo.role)
    {
      let data = [];
      for (let i = 0;i < users.length; i++)
      {
          if (users[i].orgnization != this.cookInfo.orgnization)
          {
            continue;
          }
          if (users[i].role != "CUSTOMER")
          {
            continue;
          }
          data.push({
          name   : `${users[i].name}`,
          sex    : `${this.trans.convertENtoCN(users[i].sex)}`,
          age    : users[i].age,
          orgnization: `${users[i].orgnization}`,
          role : `${this.trans.convertENtoCN(users[i].role)}`,
          status: `${this.trans.convertENtoCN(users[i].status)}`,
          addinfo: `${users[i].addinfo?"":users[i].addinfo }`
        });
      }
      this.dataSet = data;
    }
    else if ("CUSTOMER" == this.cookInfo.role)
    {
      let data = [];
      for (let i = 0;i < users.length; i++)
      {
          if (users[i].name != this.cookInfo.userName)
          {
            continue;
          }
          data.push({
          name   : `${users[i].name}`,
          sex    : `${this.trans.convertENtoCN(users[i].sex)}`,
          age    : users[i].age,
          orgnization: `${users[i].orgnization}`,
          role : `${this.trans.convertENtoCN(users[i].role)}`,
          status: `${this.trans.convertENtoCN(users[i].status)}`,
          addinfo: `${users[i].addinfo?"":users[i].addinfo }`
        });
      }
      this.dataSet = data;
    }
    else
    {
      console.log("UserManageComponent error  unknown role " + this.cookInfo.role);
    }
    /*
    for (let i = 0; i < 9; i++) {
      this.dataSet.push({
        name   : `Edward King ${i}`,
        sex    : 'girl',
        age    : 32,
        orgnization: "zhongguo",
        role : "operation",
        status: "正常",
        addinfo:"备注"

      });
    }
    */
    
  }
  unRegister(name): void {
    this.nzMessageService.info('确认注销');
    this.userService.unRegister(name,this.commonService.getHostUrl()).subscribe(()=>{});
    for (let i = 0;i < this.dataSet.length; i++){
      if (name == this.dataSet[i].name)
      {
        this.dataSet[i].status = "注销";
      }
    }

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
  showUser(event){
    console.log('event is ' + event.name);
    this.isHidden = false;
    let userinfo:User = event;
    let data = {
      name   : `${event.name}`,
      sex    : `${this.trans.convertENtoCN(event.sex)}`,
      age    : event.age,
      orgnization: `${event.orgnization}`,
      role : `${this.trans.convertENtoCN(event.role)}`,
      status: `${this.trans.convertENtoCN(userinfo.status)}`,
      addinfo: `${(userinfo.addinfo== null)?"":event.addinfo}`
    };
    let dt = [];
    dt.push(data);
    /*
    for (let i = 0; i < 1; i++) {
      dt.push({
        name   : `Edward King ${i}`,
        sex    : 'girl',
        age    : 32,
        orgnization: "zhongguo",
        role : "operation",
        status: "正常",
        addinfo:"备注"

      });
    }
    */
    this.dataSet.push(data);
    this.dataSet = [...this.dataSet];
    console.log(JSON.stringify(this.dataSet));
    
  }
  currentUser:string;
  visible = false;

  open(currentUser): void {
    console.log('tdname ' + currentUser);
    this.visible = true;
    this.currentUser = currentUser;
  }

  close(): void {
    this.visible = false;
  }
  query(){
    this.userService.getAllUsers(this.commonService.getCkheader(this.cookInfo),
                              this.commonService.getHostUrl()).subscribe((users) => 
                                   {
                                    console.log("get all from users" + JSON.stringify(users));
                                       this.updateUiFromSrv(users);
                                      });
  }


}
