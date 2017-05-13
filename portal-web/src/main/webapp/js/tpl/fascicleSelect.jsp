<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET");
response.setHeader("Access-Control-Max-Age", "60");
%>
<div modal-dialog
     show-dialog="showDialog"
     content-width="1200px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     on-confirm="onSelected()"
     on-show="onShow()">
<div class="zt_warp wrap1000">
<div class="zt-top">
    <div class="zt-toolbar">
        <div class="toolbar">
        	<button class="btn btn-default confirm-button" id="btnSearch"><i class="fa fa-check"></i> 确 定</button>
            <button ng-click="getProjectList()" class="btn btn-default" id="btnSearch"><i class="fa fa-search"></i> 查 询</button>
            <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
        </div>
    </div>
</div>
<div class="zt-search" slide-toggles>
    <div class="ser_tit">
        <div class="title">查询条件</div>
        <div class="drop"><a href="javascript:void(0)">展开</a></div>
    </div>
    <div class="ser_bolck">
        <form id="searchFormDraft" method="post" action="#">

            <ul class="ser_ul">
                <li>
                    <span class="ser_tit">分册编号:</span>
                    <input  class="inputText" ng-model="data.data.fcCode" value="" type="text">
                </li>
                <li>
                    <span class="ser_tit">项目简称:</span>
                    <input  class="inputText" ng-model="data.data.fcName" value="" type="text">
                </li>
                <li>
                    <span class="ser_tit">分册负责人:</span>
                    <input  class="inputText" ng-model="data.data.headUserName" value="" type="text" disabled>
                    <span class="btn-choose">
                        <button ng-click="view.peopleDialog = true" type="button" class="btn btn-default">选 择</button>
                    </span>
                </li>
                <li>
                    <span class="ser_tit">分册状态 :</span>
                    <select  class="form-control-select" ng-model="data.data.volumeStatus" >
                            <option ng-repeat="nodeKey in view.fenceType" value="{{nodeKey.itemKey}}">{{nodeKey.itemName}}</option>
                    </select>
                    </span>
                </li>
                
            </ul>
        </form>
    </div>
</div>
<div class="zt-body">
    <table class="table table-bordered table-striped table-hover">
        <thead class="center txt-black">
        <tr>
            <th>选择</th>
            <th>分册编号</th>
            <th>分册简称</th>
            <th>创建人</th>
            <th>创建时间</th>
        </tr>
        </thead>
        <tbody class="even center">
	        <tr ng-repeat="data in view.schDrafts" ng-click="selectProject(data)" ng-dblclick="dbSelected(data)"　>
	            <td>
	                <input ng-model="data._checked" name="d" type="checkbox">
	            </td>
	            <td>{{data.schCode}}</td>
	            <td>{{data.schName}}</td>
	            <td>{{data.headUserName}}</td>
	            <td>{{data.createDate | date: 'yyyy-MM-dd' }}</td>
	        </tr>
        </tbody>
    </table>
    <div class="tb_footer">
        <div pagination
              total-page="view.totalPage"
              total-count="view.totalCount"
              page-size="data.data.pageSize"
              current-page="data.data.currentPage"
              current-page-size="view.schDrafts.length"
              on-select-page="switchPage(currentPage, pageSize)">
        	</div>
        </div>
    </div>
</div>
</div>
<div org-users
     show-dialog="view.peopleDialog"
     modal-title="人员信息"
     company-id="'-1'"
     confirm-button="确定"
     on-selected-confirm="getUser(id,name)">
</div>
