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
     on-confirm="onSelected()">
    <div>
        <input ng-model="treeDialogView.filterField" type="text" class="inputText_lg"/>
        <!--<button ng-click="reloadTree()" type="button" class="btn btn-default"><i class="fa fa-search"></i>æ¥æ¾</button>-->
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
    <div class="tab-content" style="border:1px solid #e1e1e1; border-top:0;">
        <div role="tabpanel" class="tab-pane" ng-class="{'active': !treeDialogView.all}">
            <ol style="list-style: none;height: 222px;overflow: auto; cursor: pointer;padding:10px 0 0;margin-bottom:0;">
                <li style="float: left; margin: 5px;"
                    ng-repeat="userfulItem in usefulItems"
                    ng-class="{'selected-node' : userfulItem == selectedItem}"
                    ng-click="selected(userfulItem)"
                    ng-mouseover="flag=true"
                    ng-mouseout = "flag=false"
                    ng-style="{'color': (flag == true) ? 'blue' : 'black'}"
                    ng-dblclick="dbSelected(userfulItem)">{{userfulItem.name}}&nbsp;&nbsp;|</li>
            </ol>
        </div>
    	<div role="tabpanel" class="tab-pane" ng-class="{'active': treeDialogView.all}">
            <div class="ht_info tree-dialog" >
                <div style="height: 222px; overflow: auto; font-size: 16px; margin-left: 0px;padding:10px 0 0;margin-bottom:0;"
                     ng-include="contextServer + '/ct/js/tpl/search.contractType.node.jsp'"></div>
            </div>
    	</div>
    </div>
</div>
