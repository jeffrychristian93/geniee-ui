import {Component, OnInit} from '@angular/core';

import { USER_MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu: any;

  constructor() {

  }

  ngOnInit(): void {
    //cek user role for menu pages
    this.menu = USER_MENU_ITEMS;
  }

}
