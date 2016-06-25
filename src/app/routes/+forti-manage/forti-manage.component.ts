import { Component, OnInit, Inject } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import { SysSettingModel } from '../../models/sys-setting.model';
import { environment } from '../../environment';

declare var jQuery: any;
@Component({
  moduleId: module.id,
  selector: 'app-forti-manage',
  templateUrl: 'forti-manage.component.html',
  styleUrls: ['forti-manage.component.css'],
  directives: [NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class FortiManageComponent implements OnInit {

	public sysSettingValid = false; 

	public sysSetting: SysSettingModel = new SysSettingModel();

	public constructor(private http: Http) {

		//EnvironmentPlugin(['NODE_ENV'])
		console.info(environment);

  	}

  public ngOnInit(): void {

	  // Send Data by Ajax
	  jQuery('#ajaxWaitingModal').modal("show");
	  this.http.get(environment['urlPrefix']+'sysSetting/read')
		  .map((res: Response) => res.json())
		  .subscribe((res: Object) =>
			  this.success(res), this.logError

			  // enable button ...
		  );
  }

  
  success(response) {

	  console.info(response);

	  if(response.success === false) {
		  alert(response.message);
	  } else {
		  this.sysSetting = response.data;  
		  this.sysSettingValid = true;
	  }

	  
	  jQuery('#ajaxWaitingModal').modal("hide");
  }

  logError(error) {
	  console.info("logError");
	  alert("執行發生錯誤!!");
	  var myWindow = window.open("", "", "width=600,height=300", false);
	  myWindow.document.write(JSON.stringify(error._body));

	  jQuery('#ajaxWaitingModal').modal("hide");
  }
  
  // 更新 SysSettings
  updateSysSetting() {
	  console.info("update");
	  jQuery('#ajaxWaitingModal').modal("show");
	  //var obj = JSON.parse(this.sysSetting);
	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  
	  this.http.put(environment['urlPrefix']+"sysSetting/update", JSON.stringify(this.sysSetting), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.updateSuccess(res), this.logError
		  );
		  
  }

  updateSuccess(response) {
	  //this.sysSetting = response.data;
	  jQuery('#ajaxWaitingModal').modal("hide");
  }

  // 測試設定檔
  public getSystemStatus() {
	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this.http.post(environment['urlPrefix']+"sysSetting/getSystemStatus", JSON.stringify(this.sysSetting), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.checkSuccess(res), this.logError
		  );
  }

	public checkSuccess(response) {

		var myWindow = window.open("", "", "width=600,height=300", false);
		myWindow.document.write(JSON.stringify(response));
		jQuery('#ajaxWaitingModal').modal("hide");
	}


  // 初始化設定檔 
  public onSubmitInitial() {
	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this.http.post(environment['urlPrefix']+"sysSetting/add", JSON.stringify({}), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.addSuccess(res), this.logError
		  );
  }

  public addSuccess(response) {
	  this.sysSetting = response.data;  

	  this.sysSettingValid = true;

	  jQuery('#ajaxWaitingModal').modal("hide");

  }

}
