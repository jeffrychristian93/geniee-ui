import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {AuthGuard} from './auth-guard.service';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent, NbRegisterComponent,
  NbRequestPasswordComponent, NbResetPasswordComponent,
} from './@theme/components/auth/components';
import {NbEmailPassAuthProvider} from './@theme/components/auth/providers';
import {NbAuthModule} from './@theme/components/auth';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

@NgModule({
  // imports: [RouterModule.forRoot(routes, config)],
  imports: [
    RouterModule.forRoot(routes, config),
    NbAuthModule.forRoot({
      providers: {
        email: {
          service: NbEmailPassAuthProvider,
          config: {
            token: {
              key: 'data.token',
            },
          },
        },
      },
      forms: {
        login: formSetting,
        register: formSetting,
        requestPassword: formSetting,
        resetPassword: formSetting,
        logout: {
          redirectDelay: 0,
        },
      },
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
