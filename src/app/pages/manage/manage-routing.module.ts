import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageComponent} from './manage.component';
import {UserComponent} from './user/user.component';

const routes: Routes = [{
  path: '',
  component: ManageComponent,
  children: [{
    path: 'user',
    component: UserComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule { }

export const routedComponents = [
  ManageComponent,
  UserComponent,
];
