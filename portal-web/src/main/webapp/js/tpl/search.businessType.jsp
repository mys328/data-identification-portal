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
                    <span class="ser_tit">业务编码:</span><input ng-model="loadListQueryView.typeCode" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">业务名称:</span><input ng-model="loadListQueryView.typeName" class="inputText" type="text">
                </li>
            </ul>
        </div>
    </div>

    <div id="{{dialogId}}-BusinessTypeList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th>选择</th>
                <th>业务编码</th>
                <th>业务名称</th>
            </tr>
            </thead>
            <tbody class="even center">
            <tr ng-repeat="businessType in businessTypeView.data" ng-click="selectItem(businessType)" ng-dblclick="dbSelected(node)">
                <td><input ng-checked="businessType == selectedItem" name="businessTypeRadio" type="radio"></td>
                <td>{{businessType.typeCode}}</td>
                <td>{{businessType.typeName}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3">
                    <div pagination
                         total-page="businessTypeView.totalPage"
                         total-count="businessTypeView.totalCount"
                         page-size="businessTypeView.pageSize"
                         current-page="businessTypeView.currentPage"
                         current-page-size="businessTypeView.data.length"
                         on-select-page="switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-BusinessTypeList"></div>
</div>