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
     on-confirm="onSelected()"
     >

    <div class="ht_info">
        <div class="zt-toolbar">
            <div class="toolbar">
                <button type="button" class="btn btn-default confirm-button"><i class="fa fa-check"></i> 确 定</button>
                <button ng-disabled="view.showMask" ng-click="searchProjects()" type="button" class="btn btn-default" id="btnSearch"><i class="fa fa-search"></i> 查 询</button>
                <button class="btn btn-default" ng-click="clearData()"><i class="fa fa-trash-o"></i> 清 空</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>

        <div class="zt-search">
            <div class="ser_tit">
                <div class="title">查询条件</div>
                <div slide-toggle ref-el="<%= '#' %>{{dialogId}}-projectSearch" style="float: right; padding-right: 20px; margin-right: 10px;
                	position:absolute; right:-16px; top:-16px; width:57px; padding:5px 15px 5px 8px;"></div>
            </div>
        </div>
        <div id="{{dialogId}}-projectSearch" class="ser_bolck" style="display: none;">
            <ul class="ser_ul">
                <li><span class="ser_tit">项目简称:</span><input ng-disabled="view.showMask" ng-model="view.projShortname" class="inputText" type="text"></li>
                <li><span class="ser_tit">项目编号:</span><input ng-disabled="view.showMask" ng-model="view.projCode" class="inputText" type="text"></li>
                 <li>
                	<span class="ser_tit">用户定义项目编号:</span><input ng-disabled="view.showMask" ng-model="view.projCustomCode" class="inputText" type="text">
                </li>
                <li>
                    <span class="ser_tit">负责部门:</span><input disabled ng-model="view.chargeOrgName" class="inputText" type="text">
                    <span class="btn-choose" ng-click="view.deptDialog = true">
                        <a class="btn btn-default btn-sm" href="javascript:void(0);">选 择</a>
                    </span>
                </li>
                <li>
                    <span class="ser_tit">项目经理:</span><input disabled ng-model="view.pmName" class="inputText" type="text">
                    <span class="btn-choose" ng-click="view.pmDialog = true">
                        <a class="btn btn-default btn-sm" href="javascript:void(0);">选 择</a>
                    </span>
                </li>
                <li>
                    <span class="ser_tit">项目类型:</span>
                    <select ng-change="changeProjType()" ng-model="view.projType" ng-disabled="view.showMask" class="inputText">
                        <option value=''>全部</option>
                        <option ng-repeat="projType in view.projTypes" ng-selected="view.projType == projType.itemKey" value={{projType.itemKey}}>{{projType.itemName}}</option>
                    </select>
                </li>
                <li>
                    <span class="ser_tit">项目状态:</span>
                    <select ng-model="view.projProcessCode" ng-disabled="view.showMask" class="inputText">
                        <option value=''>全部</option>
                        <option ng-repeat="status in view.statusList" ng-selected="view.projProcessCode == status.itemKey" value={{status.itemKey}}>{{status.itemName}}</option>
                    </select>
                </li>
                <li>
                    <span class="ser_tit">项目性质:</span>
                    <select ng-model="view.projNature" ng-disabled="view.showMask" class="inputText">
                        <option value=''>全部</option>
<!--                         <option value="10">正式项目</option> -->
<!--                         <option value="20">应急项目</option> -->
                        <option ng-repeat="projNature in resultMapDic['projNature']" ng-selected="view.projNature == projNature.itemKey" value={{projNature.itemKey}}>{{projNature.itemName}}</option>
                    </select>
                </li>
            </ul>
        </div>
    </div>
    <div id="{{dialogId}}-projectList">
        <table class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th></th>
                <th>项目简称</th>
                <th>项目编号</th>
                <th>用户定义项目编号</th>
                <th>项目性质</th>
                <th>项目类型</th>
                <th>负责部门</th>
                <th>项目经理</th>
                <th>项目状态</th>
            </tr>
            </thead>
            <tbody class="even center">
            <tr ng-repeat="item in view.items"
                ng-click="selectItem(item)"
                ng-dblclick="dbSelected(item)"
                ng-class="{'selected-manuscript-project' : item == view.selectedItem}">
                <td>
                    <input type="radio" ng-checked="item == view.selectedItem">
                </td>
                <td>{{item.projShortname}}</td>
                <td>{{item.projCode}}</td>
                 <td>{{item.projCustomCode}}</td>
                <td>{{view.natureName[item.projNature]}}</td>
                <td>{{view.projTypeNames[item.projType]}}</td>
                <td>{{item.chargeOrgName}}</td>
                <td>{{item.pmName}}</td>
                <td>{{item.projProcessName}}</td>
                </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="9">
                    <div  pagination
                          total-page="view.totalPage"
                          total-count="view.totalCount"
                          page-size="view.pageSize"
                          current-page="view.currentPage"
                          current-page-size="view.items.length"
                          on-select-page="view.switchPage(currentPage, pageSize)"></div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>

    <div mask visible="view.showMask" ref-id="<%= '#' %>{{dialogId}}-projectList"></div>


</div>
<div tree-dialog
     show-dialog="view.deptDialog"
     category="organization"
     org-id="'-1'"
     dialog-id="dept"
     modal-title="负责部门"
     confirm-button="确定"
     only-select-leaf="true"
     on-selected-confirm="selectDept(id,name)"></div>

<!-- <div search-user-dialog
     show-dialog="view.pmDialog"
     category="pm"
     org-id="view.chargeOrg"
     dialog-id="pm"
     modal-title="项目经理"
     confirm-button="确定"
     only-select-leaf="true"
     on-selected-confirm="selectPm(id,name)"></div> -->
     
     <div search-user-dialog
     show-dialog="view.pmDialog"
     company-id="companyId1"
     dialog-id="projectManagerSearch"
     modal-title="选择经办人"
     confirm-button="确认"
     on-selected-confirm="selectPm(userItem)"></div>
