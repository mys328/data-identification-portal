<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<div>
	<div ng-show="totalCount > 0">
	    <div class="dataTables_length">
	        <label>每页记录
	            <select ng-change="selectPage(currentPage)" ng-model="pageSize" name="dynamic-table_length" aria-controls="dynamic-table" class="form-control input-sm">
	                <option value="5">5</option>
	                <option value="10">10</option>
	                <option value="20">20</option>
	                <option value="50">50</option>
	            </select>
	            显示记录从{{(currentPage - 1) * pageSize + 1}}到{{(currentPage - 1) * pageSize + currentPageSize}}，共{{totalCount}}条记录
	        </label>
	    </div>
	
	    <div class="dataTables_paginate dataTables_paginate_user" style="text-align: right;">
	        <ul class="pagination pagination-user">
	            <li>
	                <button ng-disabled="noPrevious()" ng-click="selectPage(1)" type="button" class="btn btn-sm btn-default">首　页</button>
	            </li>
	            <li>
	                <button ng-disabled="noPrevious()" ng-click="selectPrevious()" type="button" class="btn btn-sm btn-default">上一页</button>
	            </li>
	            <li>
	                <input ng-change="switchPage()" ng-model="currentPage"  type="text"
	                        class="form-control input-sm" style="width: 60px; vertical-align: middle; text-align: center;"> / {{totalPage}}</li>
	            <li>
	                <button ng-disabled="noNext()" ng-click="selectNext()" type="button" class="btn btn-sm btn-default">下一页</button>
	            </li>
	            <li>
	                <button ng-disabled="noNext()" ng-click="selectPage(totalPage)" type="button" class="btn btn-sm btn-default">尾　页</button>
	            </li>
	        </ul>
	    </div>
	</div>
	<div ng-show="totalCount <= 0" style="font-weight:bold">当前没有记录</div>
</div>
	