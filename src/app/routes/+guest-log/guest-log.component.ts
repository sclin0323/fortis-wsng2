import { Component, OnInit } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { AjaxWaitingComponent } from '../../ajax-waiting/ajax-waiting.component';
import { environment } from '../../environment';
import { GuestLogModel } from '../../models/guest-log.model';

declare var jQuery: any;
@Component({
  moduleId: module.id,
  selector: 'app-guest-log',
  templateUrl: 'guest-log.component.html',
  styleUrls: ['guest-log.component.css'],
  directives: [NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES, AjaxWaitingComponent]
})
export class GuestLogComponent implements OnInit {

  //  Search
	public searchWord: string = '';

  	// Table List
	public totalPages: number = 0; // 總筆數
	public pageSize:number = 30; // 每頁筆數
	public guestLogs: Array<GuestLogModel> = [];

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
			  url: _urlPrefix+'guestLog/read',
			  data: params, 
			  type: "GET", 
			  dataType: 'json',
			  success: function(response) {
				  _this.guestLogs = response.data;
			  }
		  });
	  });

	  // 手動執行查詢 Load 預設資料
	  this.onClickSearch('');

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
	  this._http.get(environment['urlPrefix']+'guestLog/read', { search: params })
		  .map((res: Response) => res.json())
		  .subscribe((res: Object) =>
			  this.readRes(res), this.logError
		  );
  }

  readRes(response) {
	  this.guestLogs = response.data;

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
