import { Component } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';

import { FortiManageComponent } from './routes/+forti-manage';
import { FortiUserDeviceManageComponent } from './routes/+forti-user-device-manage';

import { AjaxWaitingComponent } from './ajax-waiting/ajax-waiting.component';

@Component({
  moduleId: module.id,
  selector: 'fortis-wsng2-app',
  templateUrl: 'fortis-wsng2.component.html',
  styleUrls: ['fortis-wsng2.component.css'],
  directives: [ROUTER_DIRECTIVES, AjaxWaitingComponent],
  providers: [ROUTER_PROVIDERS]
})

@Routes([
		{ path: '/forti-manage', component: FortiManageComponent },
		{ path: '/forti-user-device-manage', component: FortiUserDeviceManageComponent }
])

export class FortisWsng2AppComponent {
	title = 'Fortis 管理系統';
}
