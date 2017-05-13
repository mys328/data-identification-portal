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
<!--                 <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button> -->
                <button class="btn btn-default close-button"><i class="fa fa-close"></i> 关 闭</button>
            </div>
        </div>
        <div class="block10"></div>
        <ul class="nav nav-tabs" role="tablist" style="cursor: pointer">
	    	<li role="presentation" ng-class="{'active': !csDialogView.all}" style="margin-top: 2px;font-size:15px">
	    		<a ng-click="csDialogView.all = false" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">常用</a>
	    	</li>
	    	<li role="presentation" ng-class="{'active': csDialogView.all}" style="margin-top: 2px;font-size:15px">
	    		<a ng-click="csDialogView.all = true" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">全部</a>
	    	</li>
		</ul>
		
		<div class="tab-content" style="border:1px solid #e1e1e1; border-top:0;" id="{{dialogId}}-CustomerList">
			<div role="tabpanel" class="tab-pane" ng-class="{'active': csDialogView.all}">
				<div class="zt-toolbar" style="margin: 10px 10px;">
		            <div class="toolbar">
		                <button ng-click="switchPage()" type="button" class="btn btn-default"><i class="fa fa-search"></i> 查 询</button>
		            </div>
		        </div>
		        <div class="zt-search">
		            <div class="ser_tit">
		                <div class="title">查询条件</div>
		                <div slide-toggle ref-el="<%= '#' %>{{dialogId}}-SearchCustomerForm" 
		                	style="float: right; padding-right: 20px; margin-right: 10px;
		                	position:absolute; right:-16px; top:-16px; width:57px; padding:5px 15px 5px 8px;"></div>
		            </div>
		        </div>
		        <div id="{{dialogId}}-SearchCustomerForm" class="ser_bolck" style="display: none;">
		            <ul class="ser_ul">
		                <li>
		                    <span class="ser_tit" ng-if="data.customer.sourcetype == 'source_supplier'">供应商编码:</span>
		                    <span class="ser_tit" ng-if="data.customer.sourcetype == 'source_customer'">客户编码:</span>
		                    <input ng-model="data.customer.code" class="inputText" type="text">
		                </li>
		                <li>
		                    <span class="ser_tit" ng-if="data.customer.sourcetype == 'source_supplier'">供应商名称:</span>
		                    <span class="ser_tit" ng-if="data.customer.sourcetype == 'source_customer'">客户名称:</span>
		                    <input ng-model="data.customer.name" class="inputText" type="text">
		                </li>
		               	<li ng-if="(data.customer.sourcetype == 'source_supplier') && (customerTypeFlag == 'empCustomer')">
		                    <span class="ser_tit">供应商类型:</span>
		                    <%--<select ng-model="data.customer.type" ng-disabled="view.showMask" class="inputText">--%>
		                        <%--<option value=''>全部</option>--%>
		                        <%--<option ng-repeat="type in customerTypeList" ng-selected="data.customer.type == type.itemKey" value={{type.itemKey}}>{{type.itemName}}</option>--%>
		                    <%--</select>--%>
		                    <label><input type="radio" name="type" value="1" ng-model="data.customer.type" ng-change="switchPage()">供应商</label>
		                    <label><input type="radio" name="type" value="2" ng-model="data.customer.type" ng-change="switchPage()">员工供应商</label>
		                </li>
		            </ul>
		        </div>
			    <div >
			        <table class="table table-bordered table-striped table-hover">
			            <thead class="center txt-black">
			            <tr>
			                <th></th>
			                <th>
			                	<span ng-if="data.customer.sourcetype == 'source_supplier'">供应商编码</span>
			                    <span ng-if="data.customer.sourcetype == 'source_customer'">客户编码</span>
			                </th>
			                <th>
								<span ng-if="data.customer.sourcetype == 'source_supplier'">供应商名称</span>
			                    <span ng-if="data.customer.sourcetype == 'source_customer'">客户名称</span>
							</th>
			                <th>账户组</th>
			            </tr>
			            </thead>
			            <tbody class="even center">
			            <tr ng-repeat="customer in customerView.customers" ng-click="selectCustomer(customer)" ng-dblclick="dbSelected(node)">
			                <td><input ng-checked="customer == customerView.selectedCustomer" name="customerRadio" type="radio"></td>
			                <td>{{customer.mdmcode}}</td>
			                <td>{{customer.fullname}}</td>
			                <td ng-if="data.customer.type == 1">{{bizDictMapNodes[customer.accountgroup].itemName}}</td>
			                <td ng-if="data.customer.type == 2">{{customer.accountgroup}}</td>
			            </tr>
			            </tbody>
			            <tfoot>
			            <tr>
			                <td colspan="4">
			                    <div pagination
			                         total-page="customerView.totalPage"
			                         total-count="customerView.totalCount"
			                         page-size="data.pageSize"
			                         current-page="data.currentPage"
			                         current-page-size="customerView.customers.length"
			                         on-select-page="switchPage(currentPage, pageSize)"></div>
			                </td>
			            </tr>
			            </tfoot>
			        </table>
			    </div>
			</div>
			
			<div role="tabpanel" class="tab-pane" ng-class="{'active': !csDialogView.all}">
				<div class="block10"></div>
				<div>
			        <table class="table table-bordered table-striped table-hover">
			            <thead class="center txt-black">
			            <tr>
			                <th></th>
			                <th>
			                	<span ng-if="data.customer.sourcetype == 'source_supplier'">供应商编码</span>
			                    <span ng-if="data.customer.sourcetype == 'source_customer'">客户编码</span>
			                </th>
			                <th>
								<span ng-if="data.customer.sourcetype == 'source_supplier'">供应商名称</span>
			                    <span ng-if="data.customer.sourcetype == 'source_customer'">客户名称</span>
							</th>
			                <th>账户组</th>
			            </tr>
			            </thead>
			            <tbody class="even center">
			            <tr ng-repeat="customer in csCache.data" ng-click="selectCustomer(customer)" ng-dblclick="dbSelected(node)">
			                <td><input ng-checked="customer == customerView.selectedCustomer" name="customerRadio" type="radio"></td>
			                <td>{{customer.mdmcode}}</td>
			                <td>{{customer.fullname}}</td>
			                <td ng-if="data.customer.type == 1">{{bizDictMapNodes[customer.accountgroup].itemName}}</td>
			                <td ng-if="data.customer.type == 2">{{customer.accountgroup}}</td>
			            </tr>
			            </tbody>
			            <tfoot>
			            <tr>
			                <td colspan="4">
			                    <div pagination
			                         total-page="csCache.totalPage"
			                         total-count="csCache.totalCount"
			                         page-size="data.pageSize"
			                         current-page="data.currentPage"
			                         current-page-size="csCache.customers.length"
			                         on-select-page="switchPage(currentPage, pageSize)"></div>
			                </td>
			            </tr>
			            </tfoot>
			        </table>
			    </div>
			</div>
		</div>
	</div>
    <div mask visible="customerView.showMask" ref-id="<%= '#' %>{{dialogId}}-CustomerList"></div>
</div>