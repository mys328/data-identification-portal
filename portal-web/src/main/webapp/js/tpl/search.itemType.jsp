<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET");
response.setHeader("Access-Control-Max-Age", "60");
%>

<div modal-dialog
     show-dialog="showDialog"
     content-width="1100px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     on-show="onShow()"
     on-close="onClose()"
     on-confirm="onSelected()">

    <div class="zt_warp wrap1000">
    <div class="zt-top">
        <div class="zt-toolbar">
            <div class="toolbar">
                <button type="button" class="btn btn-default confirm-button"><i class="fa fa-check"></i> 确  定</button>
                <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>
    </div>
    <div class="zt-search" slide-toggles>
        <div class="ser_tit">
            <div class="title">查询条件</div>
            <div class="drop"><a href="#nogo">展开</a></div>
        </div>
        <div class="ser_bolck">
            <form id="searchForm" method="post" action="#">

                <ul class="ser_ul">
                    <li>
                        <span class="ser_tit">物资类型编码:</span>
                        <input  class="inputText" ng-model="loadListQueryView.itemTypeCode" type="text">
                    </li>
                    <li>
                        <span class="ser_tit">物资类型描述:</span>
                        <input  class="inputText" ng-model="loadListQueryView.itemTypeDes" type="text">
                    </li>
                    <li>
                        <span class="ser_tit">费用类型编码:</span>
                        <input  class="inputText" ng-model="loadListQueryView.costCode" type="text">
                    </li>
                    <!-- <li>
                        <span class="ser_tit">分类:</span>
                        <select class="form-control-select" ng-model="loadListQueryView.type"
                                ng-options="key as value for (key,value) in typeList">
                            <option value="">全部</option>
                        </select>
                    </li> -->
                </ul>
            </form>
        </div>
    </div>

    <div class="zt-body" id="{{dialogId}}-ItemTypeList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
                <tr>
                    <th>选择</th>
                    <th>
                        公司名称
                    </th>
                    <th>
                        分类
                    </th>
                    <th>物资类型描述</th>
                    <th>
                        物资类型编码
                    </th>
                    <th>
                        费用类型编码
                    </th>
                </tr>
            </thead>
            <tbody class="even center">
                <tr ng-repeat="item in itemTypeView.data" ng-click="selectItemType(item)" ng-dblclick="dbSelected(item)">
                    <td>
                       <input type="radio" name="radiao" ng-checked="item == selectedItemType">
                    </td>
                    <td>{{item.companyName}}</td>
                    <td>{{typeList[item.type]}}</td>
                    <td>{{item.itemTypeName}}</td>
                    <td>{{item.itemTypeCode}}</td>
                    <td>{{item.costCode}}</td>
                </tr>
            </tbody>
        </table>
        <div class="tb_footer">
            <div pagination
                 total-page="itemTypeView.totalPage"
                 total-count="itemTypeView.totalCount"
                 page-size="itemTypeView.pageSize"
                 current-page="itemTypeView.currentPage"
                 current-page-size="itemTypeView.data.length"
                 on-select-page="switchPage(currentPage, pageSize)"></div>
        </div>
    </div>
    </div>
    <div mask visible="customerView.showMask" ref-id="<%= '#' %>{{dialogId}}-ItemTypeList"></div>
</div>
