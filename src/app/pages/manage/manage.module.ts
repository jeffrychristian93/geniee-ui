import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';

import { SmartTableService } from '../../@core/data/smart-table.service';
import {ManageRoutingModule, routedComponents} from './manage-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    ManageRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    SmartTableService,
  ],
})
export class ManageModule { }
