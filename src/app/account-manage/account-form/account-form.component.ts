import { Component, EventEmitter, Output,Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { User } from '../../model/user';
import { PaaswrdQuestion } from '../../model/paaswrd-question';
import { registerLocaleData } from '@angular/common';
import { GetcookieService } from '../../service/getcookie.service';
import { UserService } from '../../service/user.service';
import { Cookie } from '../../model/cookie';
import { Orgnization } from '../../model/orgnization';
import { Account } from '../../model/account';
import { AccountService } from '../../service/account.service';
import { CommomService } from '../../service/commom.service';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styles: [
    `[nz-form] {
    max-width: 600px;
  }
     button {
    margin-left: 8px;
  }`
]
})
export class AccountFormComponent implements OnInit {

  users: User[] = [];
  orgizations: Orgnization[] = [];
  accountInfo: Account = new Account();
  //questionInfo: PaaswrdQuestion = new PaaswrdQuestion();
  validateForm: FormGroup;
  @Input() cookieInfo: Cookie;
  @Output() canceleRgister = new EventEmitter<any>();
  @Output() registerUser = new EventEmitter<any>();
  registerResult = true;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    this.accountInfo.userName = this.validateForm.get("userName").value;
    this.accountInfo.name = this.validateForm.get("acountName").value;
    this.accountInfo.password = this.validateForm.get("password").value;
    this.accountInfo.orgnization = this.validateForm.get("orgnization").value;
    this.accountInfo.addInfo = this.validateForm.get("addinfo").value;
    if (this.accountInfo.addInfo == null)
    {
      this.accountInfo.addInfo = "";
    }
     //this.userService.registerUser().subscribe();
    console.log(this.accountInfo);
    if(this.validateForm.valid){
         this.accountService.addAccount(this.accountInfo,
                            this.commonService.getHostUrl()).subscribe((accountinfo)=>
                          {
                            if (accountinfo == null)
                            {
                              this.registerResult = false;
                              this.nzMessageService.create("error", `注册失败`);
                            }
                            this.registerUser.emit(accountinfo);
                            this.validateForm.reset();
                            console.log("AccountFormComponent add account is " + JSON.stringify(accountinfo));
                          });
         
    }
    else
    {
      console.log('this.validateForm.valid is '+this.validateForm.valid);
    }


  }
  setResutl(){
    this.registerResult=true;}
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
    this.canceleRgister.emit();
  }

  constructor(private fb: FormBuilder, private accountService: AccountService, private cks:GetcookieService,
    private commonService:CommomService,private userService: UserService, private nzMessageService: NzMessageService) {
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName         : [ null, [ Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required , this.confirmationValidator] ],
      orgnization      : [ null, [ Validators.required ] ],
      acountName       : [ null, [ Validators.required ] ],
      addinfo          : [ null]
    });
    console.log(this.cookieInfo);

    // 如果是客户登陆创建账号，组织和客户只能选当前组织和客户
    if (this.cookieInfo.role == "CUSTOMER")
    {
      this.orgizations.push({name: `${this.cookieInfo.orgnization}`});
      this.users.push({name: `${this.cookieInfo.userName}`});
    }
    // 如果是操作员登陆，组织取当前用户所在组织，用户选该组织下的角色是客户的用户
    if (this.cookieInfo.role == "OPMGR")
    {
      let org = new Orgnization(this.cookieInfo.orgnization);
      this.orgizations.push({name: `${this.cookieInfo.orgnization}`});
      this.userService.getAllUsers(this.commonService.getCkheader(this.cookieInfo),
                              this.commonService.getHostUrl()).subscribe((users) => 
                                   {
                                    console.log(" AccountFormComponent get all from users" + JSON.stringify(users));
                                       this.updateUiFromSrv(users);
                                      });
    }
  }
  updateUiFromSrv(users:User[]){
    for (let i = 0;i < users.length; i++)
      {
        if ("CUSTOMER" == users[i].role && this.cookieInfo.orgnization == users[i].orgnization)
        {
          this.users.push(users[i]);
        }
      }
  }
  isAmdin():boolean{
    if(this.cookieInfo.role == "ADMIN"){
      return true;
    }
    return false;
  }

}
