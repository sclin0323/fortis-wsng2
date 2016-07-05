import { Component, OnInit } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { AjaxWaitingComponent } from '../../ajax-waiting/ajax-waiting.component';
import { environment } from '../../environment';
import { SysUserModel } from '../../models/sys-user.model';

declare var jQuery: any;
@Component({
  moduleId: module.id,
  selector: 'app-sys-user',
  templateUrl: 'sys-user.component.html',
  styleUrls: ['sys-user.component.css'],
  directives: [NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES, AjaxWaitingComponent]
})
export class SysUserComponent implements OnInit {

	// add and update
	public addSysUser: SysUserModel = new SysUserModel();
	public updateSysUser: SysUserModel = new SysUserModel();
	public updateIndex: number;
	public deleteIndex: number;

	//  Search
	public searchWord: string = '';

  	// Table List
	public totalPages: number = 0; // 總筆數
	public pageSize:number = 30; // 每頁筆數
	public sysUsers: Array<SysUserModel> = [];

	// Http
	public _http: Http;


	constructor(http: Http) { 
		this._http = http;

	}


  ngOnInit() {

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
			  url: _urlPrefix+'sysUser/read',
			  data: params, 
			  type: "GET", 
			  dataType: 'json',
			  success: function(response) {
				  _this.sysUsers = response.data;
			  }
		  });
		  

	  });
  }

    // 新增 SysUser 
  public onSubmitCreate(form: any) {

  		if(this.addSysUser.password !== this.addSysUser.repassword) {
  			alert("密碼與再次密碼不一致請重新確認!!");
  			return;
  		}

	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.post(environment['urlPrefix']+"sysUser/add", JSON.stringify(this.addSysUser), { headers: headers })
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
		  var newRecord = new SysUserModel();
		  newRecord = response.data;
		  this.sysUsers.push(newRecord);

		  // 清除 Form
		  this.addSysUser = new SysUserModel();
		} else if (response.status === -1) {
			alert(response.message);
		} else {
			alert(response);
		}

	  	jQuery('#ajaxWaitingModal').modal("hide");

  }

  // 修改 Sys User
  public onClickPreUpdate(record, index) {

	  this.updateSysUser = jQuery.extend({}, record);
	  this.updateSysUser.password = '';		// Default Value
	  this.updateSysUser.newPassword = '';		// Default Value
	  this.updateSysUser.changePassword = false;	// Default Value
	  this.updateIndex = index;

	  console.info(this.updateSysUser);
	  jQuery('#crudtabs a[href="#updatetab"]').tab('show')

  }

  public onSubmitUpdate() {

  	//console.info(this.updateSysUser.newPassword);
  	//console.info(this.updateSysUser.renewPassword);
  	//console.info(this.updateSysUser.password);

  	if(this.updateSysUser.changePassword == true) {
  		if(this.updateSysUser.newPassword == null ||  this.updateSysUser.renewPassword == null || this.updateSysUser.password == null) {
  			alert("密碼欄位不可為空!!");
  			return;
  		}
  		if(this.updateSysUser.newPassword !== this.updateSysUser.renewPassword) {
  			alert("密碼與再次密碼不一致請重新確認!!");
  			return;
  		}
  	}

  		


	  jQuery('#ajaxWaitingModal').modal("show");
	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.put(environment['urlPrefix']+"sysUser/update", JSON.stringify(this.updateSysUser), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.updateSuccess(res), this.logError
		  );
  }

  public updateSuccess(response) {

		// 檢查是否有檢核錯誤
		if (response.status === 0) {
			// 更新資料
			this.sysUsers[this.updateIndex] = response.data;

			// 清除 Form
		  	this.updateSysUser = new SysUserModel();
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
	  params.set('sysUserId', record.sysUserId);

	  
	  this._http.delete(environment['urlPrefix']+"sysUser/delete", { search: params })
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
		  this.sysUsers.splice(this.deleteIndex, 1);
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
	  this._http.get(environment['urlPrefix']+'sysUser/read', { search: params })
		  .map((res: Response) => res.json())
		  .subscribe((res: Object) =>
			  this.readSuccess(res), this.logError
		  );
  }

   readSuccess(response) {
	  this.sysUsers = response.data;

	  // 計算頁數
	  this.totalPages = Math.ceil(response.total / this.pageSize);

	  jQuery('#page-selection').bootpag({ page: 1, total: this.totalPages, maxVisible: 10 });
	  jQuery('#ajaxWaitingModal').modal("hide");
  }



  logError(error) {
	  console.info("logError");
	  alert("執行發生錯誤!!");
	  var myWindow = window.open("", "", "width=600,height=300", false);
	  myWindow.document.write(JSON.stringify(error._body));

	  jQuery('#ajaxWaitingModal').modal("hide");
  }

}
