import { Component, OnInit } from '@angular/core';
import { Router, Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';

import { FortiManageComponent } from './routes/+forti-manage';
import { FortiUserDeviceManageComponent } from './routes/+forti-user-device-manage';
import { SysUserComponent } from './routes/+sys-user';

import { AjaxWaitingComponent } from './ajax-waiting/ajax-waiting.component';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from './environment';

declare var jQuery: any;
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
		{ path: '/forti-user-device-manage', component: FortiUserDeviceManageComponent },
		{ path: '/sys-user', component: SysUserComponent }
])

export class FortisWsng2AppComponent implements OnInit{
	public title = '校園無線網路後台管理系統';
	public version:string;
	public sysUserId: string;
	public sysUserName: string;

	// Http
	public _http: Http;

	constructor(http: Http, private router: Router) { 
		this._http = http;
		this.version = environment['version'];

	}

	ngOnInit() {
  		// 取得 USER 資訊
		  let params: URLSearchParams = new URLSearchParams();

		  this._http.get(environment['urlPrefix']+'sysUser/getUserInfo', { search: params })
			  .map((res: Response) => res.json())
			  .subscribe((res: Object) =>
				  this.getUserInfoRes(res), this.logError
			  );

		// 預設 Router
		this.router.navigate(['/forti-user-device-manage']);

  	}

  	getUserInfoRes(response) {
	  console.info(response.data);
	  this.sysUserId = response.data.sysUserId;
	  this.sysUserName = response.data.sysUserName;
  	}

  	logout(){
  		jQuery(location).attr('href', 'logout.html');
	}

  	

	  logError(error) {
		  console.info("logError");
		  alert("執行發生錯誤!!");
		  var myWindow = window.open("", "", "width=600,height=300", false);
		  myWindow.document.write(JSON.stringify(error._body));
	  }

}
