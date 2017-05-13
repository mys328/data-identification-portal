<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<div modal-dialog
     show-dialog="showDialog"
     content-width="600px"
     modal-title="{{modalTitle}}"
     confirm-button="{{confirmButton}}"
     show-footer="true"
     on-show="onShow()"
     on-confirm="onSelected()" >
    <div>
        <input ng-model="treeDialogView.filterField" ng-change="delayReloadTree()" type="text" class="inputText_lg queryInput"/>
        <button ng-click="reloadTree()" type="button" class="btn btn-default treeDialog"><i class="fa fa-search"></i> 查 找</button>
    </div>
    <div class="block10"></div>
    
    <ul class="nav nav-tabs" role="tablist" style="cursor: pointer">
    	<li role="presentation" ng-class="{'active': !treeDialogView.all}" style="margin-top: 2px;font-size:15px">
    		<a ng-click="treeDialogView.all = false" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">常用</a>
    	</li>
    	<li role="presentation" ng-class="{'active': treeDialogView.all}" style="margin-top: 2px;font-size:15px">
    		<a ng-click="treeDialogView.all = true" onfocus="this.blur()" style="padding-left:30px;padding-right:30px;">全部</a>
    	</li>
	</ul>
    <div class="tab-content" style="border:1px solid #e1e1e1; border-top:0;" id="{{dialogId}}-treeDialog">
        <div role="tabpanel" class="tab-pane" ng-class="{'active': !treeDialogView.all}">
            <!-- <h4 style="background-color: lightgray">常用</h4> -->
            <ol style="list-style: none;height: 222px;overflow: auto; cursor: pointer;padding:10px 0 0;margin-bottom:0;">
                <li style="float: left; margin: 5px;"
                    ng-repeat="userfulItem in usefulItems"
                    ng-class="{'selected-node' : userfulItem == selectedItem}"
                    ng-click="selected(userfulItem)"
                    ng-mouseover="flag=true"
                    ng-mouseout = "flag=false"
                    ng-style="{'color': (flag == true) ? 'blue' : 'black'}"
                    ng-dblclick="dbSelected(userfulItem)" title="{{userfulItem.path}}">{{userfulItem.name}}&nbsp;&nbsp;|</li>
            </ol>
        </div>
    	<div role="tabpanel" class="tab-pane" ng-class="{'active': treeDialogView.all}">
    		<!-- 展示树 -->
	    	<div class="tree-dialog" role="{{modalTitle}}" onselectstart="return false;" ng-if="!treeDialogView.filterField">
		        <!-- <h4 style="background-color: lightgray">全部</h4> -->
		        <ol style="height: 222px; overflow: auto; font-size: 16px; margin-left: 0px;padding:10px 0 0;margin-bottom:0;">
		            <li ng-repeat="node in nodes" ng-include="contextServer + '/ct/js/tpl/tree.node.jsp'"></li>
		        </ol>
		        <!-- <div mask visible="treeDialogView.showMask" ref-id=".tree-dialog[role='{{modalTitle}}']"></div> -->
	    	</div>
	    	<!-- 查询树 -->
	    	<div class="ht_info tree-dialog" ng-if="treeDialogView.filterField">
			    <div style="height: 222px; overflow: auto; font-size: 16px; margin-left: 0px;padding:10px 0 0;margin-bottom:0;" 
			    	ng-include="contextServer + '/ct/js/tpl/tree.node.all.jsp'"></div>
			</div>
    	</div>
    </div>
    <div mask visible="treeDialogView.showMask" ref-id="<%= '#' %>{{dialogId}}-treeDialog"></div>
</div>

