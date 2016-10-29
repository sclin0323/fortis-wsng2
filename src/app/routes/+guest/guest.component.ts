import { Component, OnInit } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { AjaxWaitingComponent } from '../../ajax-waiting/ajax-waiting.component';
import { environment } from '../../environment';
import { GuestModel } from '../../models/guest.model';

declare var jQuery: any;
@Component({
  moduleId: module.id,
  selector: 'app-guest',
  templateUrl: 'guest.component.html',
  styleUrls: ['guest.component.css'],
  directives: [NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES, AjaxWaitingComponent]
})
export class GuestComponent implements OnInit {


	// add and update
	public addGuest: GuestModel = new GuestModel();
	public deleteIndex: number;

	//  Search
	public searchWord: string = '';

	// Table List
	public totalPages: number = 0; // 總筆數
	public pageSize:number = 30; // 每頁筆數
	public guests: Array<GuestModel> = [];

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
			  url: _urlPrefix+'guest/read',
			  data: params, 
			  type: "GET", 
			  dataType: 'json',
			  success: function(response) {
				  _this.guests = response.data;
			  }
		  });
	  });

	  // 手動執行查詢 Load 預設資料
	  this.onClickSearch('');

  }

  logError(error) {
	  console.info("logError");
	  alert("執行發生錯誤!!");
	  var myWindow = window.open("", "", "width=600,height=300", false);
	  myWindow.document.write(JSON.stringify(error._body));

	  jQuery('#ajaxWaitingModal').modal("hide");
  }

    // 新增 Appoint
  public onSubmitCreate(form: any) {

	  var headers = new Headers();
	  headers.append('Content-Type', 'application/json');

	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.post(environment['urlPrefix']+"guest/add", JSON.stringify(this.addGuest), { headers: headers })
		  .map(res => res.json())
		  .subscribe((res: Object) =>
			  this.addRes(res), this.logError
		  );
  }

  public addRes(response) {
	  	console.info(response);

	  	// 檢查是否有檢核錯誤
	  	if(response.status === 0) {
		  // 新增一筆資料
		  var newRecord = new GuestModel();
		  newRecord = response.data;
		  this.guests.push(newRecord);

		  // 清除 Form
		  this.addGuest = new GuestModel();
		} else if (response.status === -1) {
			alert(response.message);
		} else {
			alert(response);
		}

	  	jQuery('#ajaxWaitingModal').modal("hide");

  }

  // 刪除
  public onSubmitDelete(record, index) {
	  this.deleteIndex = index;
	  jQuery('#ajaxWaitingModal').modal("show");
	  let params: URLSearchParams = new URLSearchParams();
	  params.set('guestId', record.guestId);
	  params.set('guestGroup', record.guestGroup);

	  console.info(record.guestAppointId);
 
	  this._http.delete(environment['urlPrefix']+"guest/delete", { search: params })
		.map(res => res.json())
	  	.subscribe((res: Object) =>
			  this.deleteRes(res), this.logError
		  );
		  
  }

  public deleteRes(response) {

	  console.info(response);

	  // 檢查是否有檢核錯誤
	  if (response.status === 0) {
		  // 刪除資料
		  this.guests.splice(this.deleteIndex, 1);

		  //this.guestAppoints.splice(this.deleteIndex, 1);
	  } else {
	  		alert(response.message);
		  //alert(response);
	  }

	  // 隱藏 Progress Bar
	  jQuery('#ajaxWaitingModal').modal("hide");
  }

  // 查詢
  public onClickSearch(searchWord) {

	  //this.searchWord = searchWord;
	  let params: URLSearchParams = new URLSearchParams();
	  params.set('searchWord', this.searchWord);
	  params.set('page', '1');
	  params.set('start', '0');
	  params.set('limit', this.pageSize.toString());

	  // 查詢預設 page 1 start 1 limit 30
	  jQuery('#ajaxWaitingModal').modal("show");
	  this._http.get(environment['urlPrefix']+'guest/read', { search: params })
		  .map((res: Response) => res.json())
		  .subscribe((res: Object) =>
			  this.readRes(res), this.logError
		  );
  }

  readRes(response) {
	  this.guests = response.data;

	  // 計算頁數
	  this.totalPages = Math.ceil(response.total / this.pageSize);

	  jQuery('#page-selection').bootpag({ page: 1, total: this.totalPages, maxVisible: 10 });
	  jQuery('#ajaxWaitingModal').modal("hide");
  }

}
