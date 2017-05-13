<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET");
response.setHeader("Access-Control-Max-Age", "60");
%>
<div modal-dialog
     show-dialog="showDialog"
     content-width="1000px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     on-show="onShow()"
     on-close="onClose()"
     show-footer="false"
     on-confirm="onSelected()">
     
     
	<div class="ht_info">
        <div style="min-height: 260px">
         	<span class="ser_tit">共计{{view.reportPage.totalCount}}条记录，每次导出{{view.reportPage.pageSize}}条，共计{{view.reportPage.lastPage}}批</span>
<!--          	<input id="shadeKey" type="text" ng-model="shadeKey" readonly="readonly"/> -->
<!--          	<button ng-click="closeInterval()">停止 interval</button> -->
         	
         	<div id="{{dialogId}}-exportPageList">
	            <table class="table table-bordered table-striped table-hover">
	                <thead class="center txt-black">
	                <tr>
	                    <th>批次</th>
	                    <th>导出记录</th>
	                    <th>下载状态</th>
	                    <th>操作</th>
	                </tr>
	                </thead>
	                <tbody class="even center" ng-if="view.reportPage.itemList.length > 0">
	                <tr ng-repeat="item in view.reportPage.itemList">
	                    <td>{{item.currentPage}}</td>
	                    <td>{{item.first}}-{{item.last}}</td>
	                    <td>
	                    	<span ng-if="item.exportFlag==null || item.exportFlag==''">未下载</span>
	                    	
	                    	<span ng-if="item.exportFlag ==2">下载中</span>
	                    	
	                    	<span ng-if="item.exportFlag ==1">下载完成</span>
	                    
	                    </td>
	                    <td>
	                    	<button type="button" ng-click="down(item)" >下载</button>
	                    </td>
	                </tr>
	                </tbody>
	            </table>
            </div> 
        </div>
    </div>

    <div mask visible="view.showExportMask" ref-id="<%= '#' %>{{dialogId}}-exportPageList"></div>
</div>