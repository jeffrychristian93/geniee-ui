import {Component, Inject, Input, OnInit} from '@angular/core';

import {NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import {getDeepFromObject} from '../auth/helpers';
import {NB_AUTH_OPTIONS} from '../auth';
import {Router} from '@angular/router';
import {NbAuthJWTToken, NbAuthService} from '../auth/services';
import {NbJSThemeOptions} from '@nebular/theme/services/js-themes/theme.options';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  // template: `
  //   <nb-layout-header>
  //     <nb-user [name]="user?.name" [picture]="user?.picture"></nb-user>
  //   </nb-layout-header>
  // `,
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;
  redirectDelay: number = 0;
  provider: string = '';
  userMenu = [{title: 'Profile'}, {title: 'Log out'}];

  constructor(@Inject(NB_AUTH_OPTIONS) protected config = {},
              private authService: NbAuthService,
              private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              protected router: Router,
              private themeService: NbThemeService,
              private analyticsService: AnalyticsService) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          // here we receive a payload from the token and assigne it to our `user` variable
          // this.user = token.getPayload();
          // this.user = token;
          try {
            this.user = token.getPayload();
            console.log('User Data : ' + JSON.stringify(this.user));
          } catch (e) {
            console.log(e);
          }
        }

      });
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.provider = this.getConfigValue('forms.logout.provider');
  }

  theme: NbJSThemeOptions;

  ngOnInit() {
    this.userService.getUsers().subscribe((users: any) => this.user = users.nick);
    this.themeService.getJsTheme().subscribe((theme: NbJSThemeOptions) => this.theme = theme);
  }

  currentBoolTheme() {
    return this.themeToBool(this.theme);
  }

  private themeToBool(theme: NbJSThemeOptions) {
    return theme.name === 'cosmic';
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  logout(): void {
    this.authService.logout(this.provider).subscribe((result) => {

      console.log('woke' + result);
      const redirect = result.getRedirect();
      console.log('redirect' + redirect);
      if (redirect) {
        console.log('rered')
        setTimeout(() => {
          return this.router.navigateByUrl('/auth/login');
        }, this.redirectDelay);
      } else {
        console.log('didir')
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
