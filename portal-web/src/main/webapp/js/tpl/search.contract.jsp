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
                    <span class="ser_tit">合同编号:</span><input ng-model="loadListQueryView.code" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">合同名称:</span><input ng-model="loadListQueryView.name" class="inputText" type="text">
                </li>
                <!-- <li>
                    <span class="ser_tit">经办部门:</span><input ng-model="loadListQueryView.deptCode" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">经办人:</span><input ng-model="loadListQueryView.agentCode" class="inputText" type="text">
                </li> -->
                <li>
                    <span class="ser_tit">合同签订时间:</span>
                    <input type="text" name="signDateMin" class="inputText_sm" id="signDateMin"
                           ng-model="loadListQueryView.signDateMin" update-time
                           onFocus="WdatePicker({isShowClear:false,readOnly:true,maxDate:'#F{$dp.$D(\'signDateMax\',{d:-1})}'})">
                        <span class="input-addon" onclick="WdatePicker({el:'signDateMin',maxDate:'#F{$dp.$D(\'signDateMax\',{d:-1})}'})">
                            <i class="fa fa-calendar"></i>
                        </span>
                    &nbsp;到&nbsp;
                    <input type="text" name="signDateMax" class="inputText_sm" id="signDateMax"
                           ng-model="loadListQueryView.signDateMax" update-time
                           onFocus="WdatePicker({isShowClear:false,readOnly:true,minDate:'#F{$dp.$D(\'signDateMin\',{d:1})}'})">
                        <span class="input-addon" onclick="WdatePicker({el:'signDateMax',minDate:'#F{$dp.$D(\'signDateMin\',{d:1})}'})">
                            <i class="fa fa-calendar"></i>
                        </span>
                    
                </li>

            </ul>
        </div>
    </div>
    <div id="{{dialogId}}-contractList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th></th>
                <th>合同编号</th>
                <th>合同名称</th>
                <th>合同分类</th>
                <th>合同金额</th>
                <th>经办部门</th>
                <th>经办人</th>
                <th>合同签订时间</th>
            </tr>
            </thead>
            <tbody class="even center">
            <tr ng-repeat="contract in contractView.data" ng-click="selectItem(contract)" ng-dblclick="dbSelected(node)">
                <td><input ng-checked="contract == selectedItem" name="contractRadio" type="radio"></td>
                <td>{{contract.code}}</td>
                <td>{{contract.name}}</td>
                <td>{{bizDictMapNodes[contract.detailTypeCode].itemName}}</td>
                <td>{{contract.amount}}</td>
                <td>{{contract.deptName}}</td>
                <td>{{contract.agentName}}</td>
                <td>{{contract.signDate | date: 'yyyy-MM-dd'}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="8">
                    <div pagination
                         total-page="contractView.totalPage"
                         total-count="contractView.totalCount"
                         page-size="contractView.pageSize"
                         current-page="contractView.currentPage"
                         current-page-size="contractView.data.length"
                         on-select-page="switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-contractList"></div>
</div>