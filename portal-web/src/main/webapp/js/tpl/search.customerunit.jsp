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
     on-confirm="onSelected()">


    <div class="ht_info">
        <div class="zt-toolbar">
            <div class="toolbar">
                <button type="button" class="btn btn-default confirm-button"><i class="fa fa-check"></i> 确 定</button>
                <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>
                <button ng-click="clear()" type="button" class="btn btn-default"><i class="fa fa-trash-o"></i> 清 空</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>
        <div class="zt-search">
            <div class="ser_tit">
                <div class="title">查询条件</div>
                <div slide-toggle ref-el="<%= '#' %>{{dialogId}}-SearchConstructionUnit" 
                	style="float: right; padding-right: 20px; margin-right: 10px;
                	position:absolute; right:-16px; top:-16px; width:57px; padding:5px 15px 5px 8px;"></div>
            </div>
        </div>
        <div id="{{dialogId}}-SearchConstructionUnit" class="ser_bolck" style="display: none;">
            <ul class="ser_ul">
                <li>
                    <span class="ser_tit">施工单位名称:</span>
                    <input ng-model="data.unit[0].unitName" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">施工单位编码:</span>
                    <input ng-model="data.unit[0].unitCode" class="inputText" type="text">
                </li>
            </ul>
        </div>
    </div>
    <div id="{{dialogId}}-ConstructionUnitList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th></th>
                <th>
                	<span>施工单位名称</span>
                </th>
                <th>
                    <span>施工单位编码</span>
				</th>
            </tr>
            </thead>

            <tbody class="even center">
            <tr ng-repeat="constructionUnit in constructionUnitView.constructionUnits" ng-click="selectConstructionUnit(constructionUnit)" ng-dblclick="dbSelected(node)">
                <td><input type="radio" ng-checked="constructionUnit == constructionUnitView.selectedConstructionUnit" type="radio"></td>
                <td>{{constructionUnit.unitName}}</td>
                <td>{{constructionUnit.unitCode}}</td>
            </tr>
            </tbody>

            <tfoot>
            <tr>
                <td colspan="6">
                    <div pagination
                         total-page="constructionUnitView.totalPage"
                         total-count="constructionUnitView.totalCount"
                         page-size="data.pageSize"
                         current-page="data.currentPage"
                         current-page-size="constructionUnitView.constructionUnits.length"
                         on-select-page="switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <div mask visible="constructionUnitView.showMask" ref-id="<%= '#' %>{{dialogId}}-ConstructionUnitList"></div>
</div>