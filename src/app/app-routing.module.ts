import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserManageComponent }   from './user-manage/user-manage.component';
import { AccountManageComponent }   from './account-manage/account-manage.component';
import { UserModifyComponent } from './user-manage/user-modify/user-modify.component';
const routes: Routes = [
  { path: '', redirectTo: '/usermanage', pathMatch: 'full' },
  { path: 'usermanage', component: UserManageComponent },
  { path: 'usermodify/:username', component: UserModifyComponent },
  { path: 'accountmanage', component: AccountManageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
