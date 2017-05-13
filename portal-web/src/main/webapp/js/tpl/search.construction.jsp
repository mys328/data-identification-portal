<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<div modal-dialog
     show-dialog="showDialog"
     content-width="1300px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     on-show="onShow()"
     on-close="onClose()"
     on-confirm="onSelected()">

    <div class="ht_info">
        <div class="zt-toolbar">
            <div class="toolbar">
                <button type="button" class="btn btn-default confirm-button"><i class="fa fa-check"></i> 确 定</button>
                <button ng-disabled="view.showMask" ng-click="searchConstructions()" type="button" class="btn btn-default" id="btnSearch"><i class="fa fa-search"></i> 查 询</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>

        <div class="zt-search">
            <div class="ser_tit">
                <div class="title">查询条件</div>
                <div slide-toggle ref-el="#constructionSearch" style="float: right; padding-right: 20px; margin-right: 10px;
                	position:absolute; right:-16px; top:-16px; width:57px; padding:5px 15px 5px 8px;"></div>
            </div>
        </div>
        <div id="constructionSearch" class="ser_bolck" style="display: block;">
            <ul class="ser_ul">
                <li><span class="ser_tit">施工小队名称:</span><input ng-disabled="view.showMask" ng-model="view.cstName" class="inputText" type="text"></li>
                <li><span class="ser_tit">施工小队编码:</span><input ng-disabled="view.showMask" ng-model="view.cstCode" class="inputText" type="text"></li>
                <li><span class="ser_tit">施工队长:</span><input ng-disabled="view.showMask" ng-model="view.teamLeader" class="inputText" type="text"></li>
                <li><span class="ser_tit">分级:</span>
                <select  ng-model="view.classification" class="inputText" >
                        <option  value="">全部</option>
                        <option  value="A">A</option>
                        <option  value="B">B</option>
                        <option  value="C">C</option>
                        <option  value="D">D</option>
                        <option  value="E">E</option>
                        
                   </select></li>
                   <!-- <li><span class="ser_tit">状态:</span>
                <select  ng-model="view.cstStatus"  class="inputText" >
                        <option  value="">全部</option>
                        <option  value="0">正常</option>
                        <option  value="1">冻结</option>
                   </select></li> -->
            </ul>
        </div>
    </div>
    <div id="constructionList">
        <table  class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th>选择</th>
                <th>施工小队名称</th>
                <th>施工小队编号</th>
                <th>施工队长</th>
                <th>联系电话</th>
                <th>所属区域</th>
                <th>分级</th>
                <th>状态</th>
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
                 <td>
                 {{item.cstName}} 
                 </td>  
                <td>
                    {{item.cstCode}}
                </td>
                <td>
                    {{item.teamLeader}}

                </td>
                <td>
                    {{item.phone}}

                </td>
                <td>
                    {{item.areaId}}

                </td>
                <td>
               {{item.classification}}    
                </td>
                 <td>
                    {{item.cstStatus |statusFilter}}
                </td>
                </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="8">
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

    <div mask visible="view.showMask" ref-id="#constructionList"></div>
</div>
</div>