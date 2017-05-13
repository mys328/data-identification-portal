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
    <div class="zt-search">
        <div class="ser_tit">
            <div class="title">查询条件</div>
           <div class="drop"><a slide-toggle ref-el="<%= '#' %>{{dialogId}}-taxCodeSearch">展开</a></div>
        </div>
        <div class="ser_bolck" id="{{dialogId}}-taxCodeSearch" style="display: none;">
            <ul class="ser_ul">
                <li>
                    <span class="ser_tit">税码:</span><input ng-model="loadListQueryView.id" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">税率:</span><input ng-model="loadListQueryView.taxRate" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">税类型:</span>
                    <select class="inputText" ng-model="loadListQueryView.taxType"
                        ng-options="option.taxType as option.taxTypeDescription for option in taxTypeList">
                        <option value="">--选择--</option>
                    </select>
                </li>
                <li>
                    <span class="ser_tit">是否可抵扣:</span>
                    <select class="inputText" ng-model="loadListQueryView.isDeduction">
                        <option value="">--选择--</option>
                        <option ng-value="0">是</option>
                        <option ng-value="1">否</option>
                    </select>
                </li>
            </ul>
        </div>
    </div>
    <div id="{{dialogId}}-TaxList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th>选择</th>
                <th>税码</th>
                <th>描述</th>
                <th>税率</th>
                <th>是否可抵扣</th>
                <th>使用发票类型</th>
                <th>税类型</th>
            </tr>
            </thead>
            <tbody class="even center">
            <tr ng-repeat="taxcode in taxcodeView.data" ng-click="selectItem(taxcode)" ng-dblclick="dbSelected(node)">
                <td><input ng-checked="taxcode == selectedItem" name="taxcodeRadio" type="radio"></td>
                <td>{{taxcode.id}}</td>
                <td>{{taxcode.description}}</td>
                <td>{{taxcode.taxRate}}</td>
                <td>{{taxcode.isDeduction == '0' ? '是' : '否'}}</td>
                <td>{{taxcode.invoiceTypeDescription}}</td>
                <td>{{taxcode.taxTypeDescription}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="7">
                    <div pagination
                         total-page="taxcodeView.totalPage"
                         total-count="taxcodeView.totalCount"
                         page-size="taxcodeView.pageSize"
                         current-page="taxcodeView.currentPage"
                         current-page-size="taxcodeView.data.length"
                         on-select-page="switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-TaxList"></div>
</div>