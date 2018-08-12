import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../service/user.service';
import { GetcookieService } from '../service/getcookie.service';
import { Cookie } from '../model/cookie';
import { User } from '../model/user';
@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
 
  dataSet: Array<{ name: string; sex: string; age:number; orgnization: string; role:string }> = [];
  cookInfo:Cookie;
  isHidden: boolean = false;
  userInfo: User;
  constructor(private nzMessageService: NzMessageService, private userService: UserService, private cks:GetcookieService) {}
  ngOnInit(): void {
    this.cookInfo = this.cks.getcookie();
    //this.userService.getAllUsers();
    
    for (let i = 0; i < 46; i++) {
      this.dataSet.push({
        name   : `Edward King ${i}`,
        sex    : 'girl',
        age    : 32,
        orgnization: "zhongguo",
        role : "operation"
      });
    }
    
  }
  
  unRegister(): void {
    this.nzMessageService.info('确认注销');
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
    this.dataSet.push({
      name   : `${userinfo.name}`,
      sex    : `${userinfo.sex}`,
      age    : userinfo.age,
      orgnization: `${userinfo.orgnization}`,
      role : `${userinfo.role}`
    });
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



}
