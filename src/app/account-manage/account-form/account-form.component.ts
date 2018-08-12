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
  questionInfo: PaaswrdQuestion = new PaaswrdQuestion();
  validateForm: FormGroup;
  @Input() cookieInfo: Cookie;
  @Output() canceleRgister = new EventEmitter<any>();
  @Output() registerUser = new EventEmitter<any>();
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
         this.registerUser.emit(this.accountInfo);
         this.validateForm.reset();
    }
    else
    {
      console.log('this.validateForm.valid is '+this.validateForm.valid);
    }


  }

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

  constructor(private fb: FormBuilder, private ck :GetcookieService, private userService: UserService) {
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
    
    if (this.isAmdin())
    {
      //this.userService.getAllOrg();
      this.orgizations.push({userName: `${this.cookieInfo.userName}`});// todo remove
    }
    else
    {
      this.orgizations.push({userName: `${this.cookieInfo.userName}`});
    }
    
    //let cookInfo = this.ck.getcookie();
    //this.accountInfo.name

    // 如果是客户登陆创建账号，组织和客户只能选当前组织和客户
    // 如果是操作员登陆，组织取当前用户所在组织，用户选该组织下的角色是客户的用户
  }
  isAmdin():boolean{
    if(this.cookieInfo.role == "ADMIN"){
      return true;
    }
    return false;
  }

}
