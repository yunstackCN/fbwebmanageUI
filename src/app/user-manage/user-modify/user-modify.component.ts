import { Component, OnInit, Output ,Input ,EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../service/user.service';
import { UserPassword } from '../../model/user-password';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent implements OnInit {
  @Input() username: string;
  @Output() returnMain = new EventEmitter<any>();
  modifyvalidateForm: FormGroup;
  userpassword: UserPassword = new UserPassword();
  
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private fb: FormBuilder) { 
      this.modifyvalidateForm = this.fb.group({
        modifypassword         : [ null, [ Validators.required ] ],
        modifycheckPassword    : [ null, [ Validators.required , this.confirmationValidator] ]
      });
    }
  
  ngOnInit() {
    /*
    this.userpassword.name =  this.route.snapshot.paramMap.get('username');
    */
   this.userpassword.name =  this.username;
    console.log("this.userpassword.name" + this.userpassword.name);
  }
  goBack(): void {
    this.location.back();
  }
 /*
 save(): void {
    this.userService.modifyPassword(this.userpassword)
      .subscribe(() => this.goBack());
  }
 */ 
  submitForm(): void {
    for (const i in this.modifyvalidateForm.controls) {
      this.modifyvalidateForm.controls[ i ].markAsDirty();
      this.modifyvalidateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.modifyvalidateForm.valid)
    {
      this.userpassword.password = this.modifyvalidateForm.get("modifypassword").value;
      //save();
      this.modifyvalidateForm.reset();
      this.returnMain.emit();
    }
    
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.modifyvalidateForm.controls.modifycheckPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.modifyvalidateForm.controls.modifypassword.value) {
      return { confirm: true, error: true };
    }
  }
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.modifyvalidateForm.reset();
    for (const key in this.modifyvalidateForm.controls) {
      this.modifyvalidateForm.controls[ key ].markAsPristine();
      this.modifyvalidateForm.controls[ key ].updateValueAndValidity();
    }
    this.returnMain.emit();
  }
  
}
