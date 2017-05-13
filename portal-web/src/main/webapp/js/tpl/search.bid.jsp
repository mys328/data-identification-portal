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
    <div>
    <div class="block10"></div>
        <div slide-toggles class="zt-search">
            <div class="ser_tit">
                <div class="title">查询条件</div>
                <div class="drop"><a href="javascript:void(0)">展开</a></div>
            </div>
            <div class="ser_bolck">
                <form id="searchForm" method="post" action="#">
                    <ul class="ser_ul">
                        <li>
                            <span class="ser_tit">投标名称:</span>
                            <input  class="inputText" value="" type="text" ng-model="data.bid.biddingName" >
                        </li>
                        <li><span class="ser_tit">投标编号:</span>
                            <input  class="inputText" value="" type="text" ng-model="data.bid.biddingCode" >
                        </li>

                    </ul>
                </form>
            </div>
    </div>

    <div class="zt-body" >
        <div >
            <table class="table table-bordered table-striped table-hover" id="{{dialogId}}-BidList">
                <thead class="center txt-black">
                <tr>
                    <th></th>
                    <th>投标编号</th>
                    <th>投标名称</th>
                    <th>中标通知书编号</th>
                </tr>
                </thead>
                <tbody class="even">
                <tr ng-repeat="item in bidView.bids" ng-show="bidView.bids.length != 0" ng-click='selectBid(item)' ng-dblclick="dbSelected(node)">
                    <td><input ng-checked="item == bidView.selectedBid" name="bidRadio" type="radio"></td>
                    <td>{{item.biddingCode}}</td>
                    <td>{{item.biddingName}}</td>
                    <td>{{item.bidFeenbackVO.bidnumber}}</td>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">
                        <div pagination
                             total-page="bidView.totalPage"
                             total-count="bidView.totalCount"
                             page-size="data.pageSize"
                             current-page="data.currentPage"
                             current-page-size="bidView.bids.length"
                             on-select-page="switchPage(currentPage, pageSize)"></div>
                    </td>
                </tr>
            </tfoot>
            </table>
            <div mask visible="bidView.showMask" ref-id="<%= '#' %>{{dialogId}}-BidList"></div>
        </div>
    </div>
    </div>
    </div>
</div>

