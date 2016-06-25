import { Component, OnInit } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { AjaxWaitingComponent } from '../../ajax-waiting/ajax-waiting.component';
import { environment } from '../../environment';
import { UserDeviceModel } from '../../models/user-device.model';

declare var jQuery: any;
@Component({
  moduleId: module.id,
  selector: 'app-forti-user-device-manage',
  templateUrl: 'forti-user-device-manage.component.html',
  styleUrls: ['forti-user-device-manage.component.css'],
  directives: [NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES, AjaxWaitingComponent]
})
export class FortiUserDeviceManageComponent implements OnInit {


	// add and update
	public addUserDevice: UserDeviceModel = new UserDeviceModel();
	public updateUserDevice: UserDeviceModel = new UserDeviceModel();
	public updateIndex: number;
	public deleteIndex: number;

	//  Search
	public searchWord: string = '';

	// Table List
	public totalPages: number = 0; // 總筆數
	public pageSize:number = 30; // 每頁筆數
	public userDevices: Array<UserDeviceModel> = [];

	// Http
	public _http: Http;


	constructor(http: Http) { 
		this._http = http;

		// test
		this.addUserDevice.macAddress = "00:0a:95:9d:68:16";
	}

  public ngOnInit(): void {


	  // 初始化 Table Paging
	  var _this = this;
	  var _urlPrefix = environment['urlPrefix']
	  jQuery('#page-selection').bootpag({
		  total: this.totalPages
	  }).on("page", function(event, /* page number here */ num) {

		  var start = ((parseInt(num) - 1) * _this.pageSize);
		  var limit = _this.pageSize;
		  var params = {
			  'searchWord': jQuery('#searchWord').val(),
			  'page': num,
			  'start': start,
			  'limit': limit
		  };

		  jQuery.ajax({
			  url: _urlPrefix+'userDevice/read',
			  data: params, 
			  type: "GET", 
			  dataType: 'json',
			  success: function(response) {
				  _this.userDevices = response.data;
			  }
		  });
		  

	  });
  }

  // 新增 User Devices
  public onSubmitCreate(form: any) {

	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.post(environment['urlPrefix']+"userDevice/add", JSON.stringify(this.addUserDevice), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.addSuccess(res), this.logError
		  );
  }

  public addSuccess(response) {
	  	console.info(response);

	  	// 檢查是否有檢核錯誤
	  	if(response.status === 0) {
		  // 新增一筆資料
		  var newRecord = new UserDeviceModel();
		  newRecord = response.data;
		  this.userDevices.push(newRecord);
		} else if (response.status === -1) {
			alert(response.message);
		} else {
			alert(response);
		}

	  	jQuery('#ajaxWaitingModal').modal("hide");

  }

  // 修改 User Device
  public onClickPreUpdate(record, index) {

  		console.info(record);

	  this.updateUserDevice = jQuery.extend({}, record);
	  this.updateIndex = index;

	  console.info(this.updateUserDevice);
	  jQuery('#crudtabs a[href="#updatetab"]').tab('show')

  }

  public onSubmitUpdate() {
	  jQuery('#ajaxWaitingModal').modal("show");
	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.put(environment['urlPrefix']+"userDevice/update", JSON.stringify(this.updateUserDevice), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.updateSuccess(res), this.logError
		  );
  }

  public updateSuccess(response) {

		// 檢查是否有檢核錯誤
		if (response.status === 0) {
			// 更新資料
			this.userDevices[this.updateIndex] = response.data;
		} else if (response.status === -1) {
			alert(response.message);
		} else {
			alert(response);
		}

  		// 隱藏 Progress Bar
	  	jQuery('#ajaxWaitingModal').modal("hide");
  }

  // 刪除
  public onSubmitDelete(record, index) {
	  this.deleteIndex = index;
	  jQuery('#ajaxWaitingModal').modal("show");
	  let params: URLSearchParams = new URLSearchParams();
	  params.set('deviceName', record.deviceName);
	  this._http.delete(environment['urlPrefix']+"userDevice/delete", { search: params })
		.map(res => res.json())
	  	.subscribe((res: Object) =>
			  this.deleteSuccess(res), this.logError
		  );
  }

  public deleteSuccess(response) {

	  console.info(response);

	  // 檢查是否有檢核錯誤
	  if (response.status === 0) {
		  // 刪除資料
		  console.info(response);
		  this.userDevices.splice(this.deleteIndex, 1);
	  } else {
		  //alert(response);
	  }

	  // 隱藏 Progress Bar
	  jQuery('#ajaxWaitingModal').modal("hide");
  }


  // 查詢 User Devices
  public onClickSearch(searchWord) {

	  //this.searchWord = searchWord;
	  let params: URLSearchParams = new URLSearchParams();
	  params.set('searchWord', this.searchWord);
	  params.set('page', '1');
	  params.set('start', '0');
	  params.set('limit', this.pageSize.toString());

	  // 查詢預設 page 1 start 1 limit 30
	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.get(environment['urlPrefix']+'userDevice/read', { search: params })
		  .map((res: Response) => res.json())
		  .subscribe((res: Object) =>
			  this.readSuccess(res), this.logError
		  );
  }


  logError(error) {
	  console.info("logError");
	  alert("執行發生錯誤!!");
	  var myWindow = window.open("", "", "width=600,height=300", false);
	  myWindow.document.write(JSON.stringify(error._body));

	  jQuery('#ajaxWaitingModal').modal("hide");
  }

  readSuccess(response) {
	  this.userDevices = response.data;

	  // 計算頁數
	  this.totalPages = Math.ceil(response.total / this.pageSize);

	  jQuery('#page-selection').bootpag({ page: 1, total: this.totalPages, maxVisible: 10 });
	  jQuery('#ajaxWaitingModal').modal("hide");
  }

  // 新增 - 轉換網卡 to LowerCase
  setLowerCaseAddMacAddress(event) {
  	this.addUserDevice.macAddress = this.addUserDevice.macAddress.toLowerCase();
  }
  // 更新 - 轉換網卡 to LowerCase
  setLowerCaseUpdateMacAddress(event) {
  	this.updateUserDevice.macAddress = this.updateUserDevice.macAddress.toLowerCase();
  }


}
