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
                <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
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
                    <span class="ser_tit">商机名称:</span><input ng-model="loadListQueryView.attrs.businessName" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">商机编号:</span><input ng-model="loadListQueryView.attrs.businessCode" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">客户名称:</span><input ng-model="loadListQueryView.attrs.customerName" class="inputText" type="text" ng-disabled="true">
                    <span class="btn-choose" ng-click="view.showCustomerSearchDialog = true">
                            <a class="btn btn-default btn-sm" href="javascript:void(0);">选 择</a>
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div>
        <table class="table table-bordered table-striped table-hover" id="{{dialogId}}-BusinessList">
            <thead class="center txt-black">
            <tr>
                    <th></th>
                    <th>商机编号</th>
                    <th>商机名称</th>
                    <th>客户名称</th>
                    <th>创建时间</th>

            </tr>
            </thead>
            <tbody class="even center">
            	<tr ng-repeat="item in businessData.data" ng-click="selectItem(item)" ng-dblclick="dbSelected(node)">
                <td><input ng-checked="item == selectedItem" name="contractRadio" type="radio"></td>
                <td>{{item.businessCode}}</td>
                <td>{{item.businessName}}</td>
                <td>{{item.supplyName}}</td>
                <td>{{item.createDate | date:'yyyy-MM-dd'}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="5">
                    <div pagination
                         total-page="businessData.totalPage"
                         total-count="businessData.totalCount"
                         page-size="businessData.pageSize"
                         current-page="businessData.currentPage"
                         current-page-size="businessData.data.length"
                         on-select-page="switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-BusinessList"></div>
    </div>
</div>
<div search-customer-dialog
     show-dialog="view.showCustomerSearchDialog"
     sourcetype="source_customer"
     modal-title="客户查询"
     confirm-button="确定"
     on-selected-confirm="selectCustomer(customer)"></div>