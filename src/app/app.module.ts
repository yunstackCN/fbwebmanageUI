import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { UserManageComponent } from './user-manage/user-manage.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserFormComponent } from './user-manage/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountManageComponent } from './account-manage/account-manage.component';
import { AccountFormComponent } from './account-manage/account-form/account-form.component';
import { UserModifyComponent } from './user-manage/user-modify/user-modify.component';
import { AccountImportComponent } from './account-manage/account-import/account-import.component';
import { CookieService } from 'ngx-cookie-service';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    UserManageComponent,
    UserFormComponent,
    AccountManageComponent,
    AccountFormComponent,
    UserModifyComponent,
    AccountImportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
     ReactiveFormsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
