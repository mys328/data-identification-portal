<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET");
response.setHeader("Access-Control-Max-Age", "60");
%>
<div modal-dialog
     show-dialog="showDialog"
     content-width="900px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     on-show="onShow()"
     on-close="onClose()"
     on-confirm="onSelected()">


    <div class="ht_info">
        <div class="zt-toolbar">
            <div class="toolbar">
                <button type="button" class="btn btn-default confirm-button"><i class="fa fa-check"></i> 确 定</button>
                <%--<button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>--%>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>
        <div class="block10"></div>
	    <ul class="nav nav-tabs" role="tablist" style="cursor: pointer">
	    	<li role="presentation" ng-class="{'active': !userDialogView.all}" style="margin-top: 2px;font-size:15px">
	    		<a ng-click="userDialogView.all = false" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">常用</a>
	    	</li>
	    	<li role="presentation" ng-class="{'active': userDialogView.all}" style="margin-top: 2px;font-size:15px">
	    		<a ng-click="userDialogView.all = true" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">全部</a>
	    	</li>
		</ul>
		<div class="tab-content" style="border:1px solid #e1e1e1; border-top:0;" id="{{dialogId}}-userList">
		<div role="tabpanel" class="tab-pane" ng-class="{'active': userDialogView.all}">
			 <div class="zt-toolbar" style="margin: 10px 10px;">
	            <div class="toolbar">
	                <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>
	            </div>
	        </div>
		    <div class="zt-search" slide-toggles>
		        <div class="ser_tit">
		            <div class="title">查询条件</div>
		            <div class="drop"><a href="javascript:void(0);">展开</a></div>
		        </div>
		        <div class="ser_bolck" >
		            <ul class="ser_ul">
		                <li>
		                    <span class="ser_tit">用户名称:</span><input ng-model="loadListQueryView.userName" class="inputText" type="text">
		                </li>
		                <li>
		                    <span class="ser_tit">用户账号:</span><input ng-model="loadListQueryView.account" class="inputText" type="text">
		                </li>
<!-- 		                <li> -->
<!-- 		                    <span class="ser_tit">手机号码:</span><input ng-model="loadListQueryView.mobile" class="inputText" type="text"> -->
<!-- 		                </li> -->
		                <li>
		                    <span class="ser_tit">所属部门:</span><input ng-model="loadListQueryView.orgPathName" class="inputText" type="text">
		                </li>
		            </ul>
		        </div>
		    </div>
		    <div>
		        <table class="table table-bordered table-striped table-hover">
		            <thead class="center txt-black">
		            <tr>
		                <th>选择</th>
		                <th>用户账号</th>
		                <th>用户名称</th>
		                <th>所属部门</th>
		            </tr>
		            </thead>
		            <tbody class="even center">
		            <tr ng-repeat="user in userView.data" ng-click="selectItem(user)" ng-dblclick="dbSelected(user)">
		                <td><input ng-checked="user == selectedItem" name="userRadio" type="radio"></td>
		                <td>{{user.account}}</td>
		                <td>{{user.userName}}</td>
		                <td>{{user.orgPathName}}</td>
		            </tr>
		            </tbody>
		            <tfoot>
		            <tr>
		                <td colspan="8">
		                    <div pagination
		                         total-page="userView.totalPage"
		                         total-count="userView.totalCount"
		                         page-size="userView.pageSize"
		                         current-page="userView.currentPage"
		                         current-page-size="userView.data.length"
		                         on-select-page="switchPage(currentPage, pageSize)"></div>
		                </td>
		            </tr>
		            </tfoot>
		        </table>
		    </div>
		</div>
		<div role="tabpanel" class="tab-pane" ng-class="{'active': !userDialogView.all}">
		<div class="block10"></div>
			<div>
		        <table class="table table-bordered table-striped table-hover">
		            <thead class="center txt-black">
		            <tr>
		                <th>选择</th>
		                <th>用户账号</th>
		                <th>用户名称</th>
		                <th>所属部门</th>
		            </tr>
		            </thead>
		            <tbody class="even center">
		            <tr ng-repeat="user in userCache.data" ng-click="selectItem(user)" ng-dblclick="dbSelected(user)">
		                <td><input ng-checked="user == selectedItem" name="userRadio" type="radio"></td>
		                <td>{{user.account}}</td>
		                <td>{{user.userName}}</td>
		                <td>{{user.orgPathName}}</td>
		            </tr>
		            </tbody>
		            <tfoot>
		            <tr>
		                <td colspan="8">
		                    <div pagination
		                         total-page="userCache.totalPage"
		                         total-count="userCache.totalCount"
		                         page-size="userCache.pageSize"
		                         current-page="userCache.currentPage"
		                         current-page-size="userCache.data.length"
		                         on-select-page="switchPageByCache(currentPage, pageSize)"></div>
		                </td>
		            </tr>
		            </tfoot>
		        </table>
		    </div>
		</div>
		</div>
	</div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-userList"></div>
</div>