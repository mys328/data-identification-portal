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
                <button ng-disabled="view.showMask" ng-click="searchContacts()" type="button" class="btn btn-default" id="btnSearch"><i class="fa fa-search"></i> 查 询</button>
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>

        <div class="zt-search">
            <div class="ser_tit">
                <div class="title">查询条件</div>
                <div slide-toggle ref-el="<%= '#' %>{{dialogId}}-contactSearch" style="float: right; padding-right: 20px; margin-right: 10px; 
                	position:absolute; right:-16px; top:-16px; width:57px; padding:5px 15px 5px 8px;"></div>
            </div>
        </div>
        <div id="{{dialogId}}-contactSearch" class="ser_bolck" style="display: none;">
            <ul class="ser_ul">
               
                <li><span class="ser_tit">联系人姓名:</span><input ng-disabled="view.showMask" ng-model="view.contactName" class="inputText" type="text"></li>
               
            </ul>
        </div>
    </div>
    <div id="{{dialogId}}-contactList">
        <table  class="table table-bordered table-striped table-hover">
            <thead class="center txt-black">
            <tr>
                <th>选择</th>
                <th>联系人姓名</th>
                <th>联系人电话</th>

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
                 {{item.contactName}} 
                    
                 </td>      
                  <td>
                       {{item.contactPhone}} 
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

    <div mask visible="view.showMask" ref-id="<%= '#' %>{{dialogId}}-contactList"></div>
</div>
</div>