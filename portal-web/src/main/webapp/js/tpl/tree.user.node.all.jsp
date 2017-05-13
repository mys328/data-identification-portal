<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<ol style="list-style: none;-webkit-padding-start: 20px;margin:0;font-family:'宋体';font-size:14px;line-height:26px;" >
    <li ng-repeat="node in nodes" ng-if="isShown(node)" >
        <div ng-style="getStyle(getLevel(node))">
            <i ng-if="node.children && node.children.length > 0" ng-click="node.open = !node.open;"
               ng-style="{'visibility': !(node.children && node.children.length > 0) == false ? 'visible' : 'hidden'}"
               ng-class="{'glyphicon-minus-sign': node.open, 'glyphicon-plus-sign': !node.open}"
               class="glyphicon" style="cursor: pointer;color: #959393;"></i>
            <span ng-if="!(node.children && node.children.length > 0)">
                <i style="visibility: hidden">&nbsp;</i>
            </span>
            <a href="javascript:void(0)" style="cursor: pointer"
                ng-style="{'background-color' : (node == treeDialogView.selectedNode) ? 'darkgray': 'white', 
			         'padding' : (node == treeDialogView.selectedNode) ? '5px': '0',
			         'color': (node == treeDialogView.selectedNode) ? 'white' : 'black'}"
			         ng-click="getUsersList(node)">
			         {{node.name}}
			</a>
        </div>
    </li>
</ol>