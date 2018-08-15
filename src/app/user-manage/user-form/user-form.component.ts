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
import { CommomService } from '../../service/commom.service';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
styles: [
    `[nz-form] {
    max-width: 600px;
  }
     button {
    margin-left: 8px;
  }`
]
})
export class UserFormComponent implements OnInit {
  orgizations: Orgnization[] = [];
  userInfo: User = new User();
  questionInfo: PaaswrdQuestion = new PaaswrdQuestion();
  validateForm: FormGroup;
  @Input() cookieInfo: Cookie;
  @Output() canceleRgister = new EventEmitter<any>();
  @Output() registerUser = new EventEmitter<any>();
  submitForm(): void {
    console.log(this.validateForm.get("role").value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    
    this.userInfo.name = this.validateForm.get("name").value;
    this.userInfo.password = this.validateForm.get("password").value;
    if (this.validateForm.get("orgnization").value == null){
      this.userInfo.orgnization = "--";
    }
    else
    {
      this.userInfo.orgnization = this.validateForm.get("orgnization").value;
    }
    this.userInfo.sex = this.validateForm.get("sex").value;
    this.userInfo.role = this.validateForm.get("role").value;
    
    this.userInfo.age = this.validateForm.get("age").value;
    if (this.validateForm.get("addinfo").value == null)
    {
      this.userInfo.addinfo = " ";
    }
    else{
      this.userInfo.addinfo = this.validateForm.get("addinfo").value;
    }
    
    this.questionInfo.userName = this.validateForm.get("name").value;
    this.questionInfo.question = this.validateForm.get("question").value;
    this.questionInfo.answer = this.validateForm.get("answer").value;
     //this.userService.registerUser().subscribe();
    console.log(this.userInfo);
    if(this.validateForm.valid || 
      ((this.validateForm.get('role').value  == "ADMIN") && this.validateForm.get("name").valid && this.validateForm.get("password").valid &&
      !(this.validateForm.get("orgnization").valid) && this.validateForm.get("sex").valid && 
      this.validateForm.get("role").valid && this.validateForm.get("answer").valid 
      && this.validateForm.get("question").valid && this.validateForm.get("checkPassword").valid )){
         
         this.userService.registerUser(this.userInfo, this.commonService.getCkheader(this.cookieInfo),
         this.commonService.getHostUrl()).subscribe(((user)=>
            { 
              this.registerUser.emit(user);
              this.validateForm.reset();
            }));

         this.userService.addQuestion(this.questionInfo, this.commonService.getCkheader(this.cookieInfo),
         this.commonService.getHostUrl()).subscribe((()=>{}));
         
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

  constructor(private fb: FormBuilder,  private userService: UserService, private cks:GetcookieService,private commonService:CommomService) {
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name             : [ null, [ Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required , this.confirmationValidator] ],
      orgnization      : [ null, [ Validators.required ] ],
      sex              : [ null, [ Validators.required ] ],
      age              : [ null],
      role             : [ null, [ Validators.required ] ],
      question         : [ null, [ Validators.required ] ],
      answer           : [ null, [ Validators.required ] ],
      addinfo          : [ null]
    });
    
    if (this.isAmdin())
    {
      this.userService.getAllOrg(this.commonService.getHostUrl()).subscribe(
        (orgs)=>{this.orgizations = [...orgs];}
      );
      //this.orgizations.push({userName: `${this.cookieInfo.userName}`});// todo remove
    }
    else
    {
      this.orgizations.push({name: `${this.cookieInfo.orgnization}`});
    }
    
    //let cookInfo = this.ck.getcookie();
    //this.userInfo.name
  }
  isAmdin():boolean{
    if(this.cookieInfo.role == "ADMIN"){
      return true;
    }
    return false;
  }
  isOperator():boolean{
    if(this.cookieInfo.role == "OPMGR"){
      return true;
    }
    return false;
  }
  iOrg():boolean{
    if(this.cookieInfo.role == "ORGMGR"){
      return true;
    }
    return false;
  }
  iCustom():boolean{
    if(this.cookieInfo.role == "CUSTOMER"){
      return true;
    }
    return false;
  }
  isChoseAdmi():boolean{
    //console.log('current role is ' + this.validateForm.get('role').value);
    if(this.validateForm.get('role').value  == "ADMIN")
    {
      return false;
    }
    return true;
  }
  
}

