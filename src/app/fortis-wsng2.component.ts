import { Component, OnInit } from '@angular/core';
import { Router, Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import { FortiUserDeviceManageComponent } from './routes/+forti-user-device-manage';
import { SysUserComponent } from './routes/+sys-user';
import { SysSettingComponent } from './routes/+sys-setting';
import { UserDeviceLogComponent } from './routes/+user-device-log';

import { GuestComponent } from './routes/+guest';
import { GuestLogComponent } from './routes/+guest-log';

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
		{ path: '/forti-user-device-manage', component: FortiUserDeviceManageComponent },
		{ path: '/user-device-log', component: UserDeviceLogComponent },
		{ path: '/guest', component: GuestComponent },
		{ path: '/guest-log', component: GuestLogComponent },

		{ path: '/sys-user', component: SysUserComponent },
		{ path: '/sys-setting', component: SysSettingComponent }
])

export class FortisWsng2AppComponent implements OnInit{
	public title = '校園無線網路後台管理系統';
	public version:string;
	public sysUserId: string;
	public sysUserName: string;

	public enableUserDevice: boolean;
	public enableGuest: boolean;

	// Http
	public _http: Http;

	constructor(http: Http, private router: Router) { 
		this._http = http;
		this.version = environment['version'];

	}

	ngAfterViewInit() {
	  	// 控制頁面 GO TOP
	  	jQuery('#gotop').click(function (e) {
			e.preventDefault();
			jQuery('html, body').animate({
				scrollTop: 0
			}, 500);
		});
		jQuery(window).scroll(function () {
			
			if (jQuery(this).scrollTop() > 160) {
				jQuery('#gotop').stop().fadeIn('fast');
			} else {
				jQuery('#gotop').stop().fadeOut('fast');
			}
		});
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
		this.router.navigate(['/sys-setting']);

  	}

  	getUserInfoRes(response) {
	  console.info(response.data);
	  this.sysUserId = response.data.sysUserId;
	  this.sysUserName = response.data.sysUserName;

	  this.enableUserDevice = response.data.enableUserDevice;
	  this.enableGuest = response.data.enableGuest;
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
