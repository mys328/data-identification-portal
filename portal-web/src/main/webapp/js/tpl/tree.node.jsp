<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<ol style="list-style: none;-webkit-padding-start: 20px;margin:0;font-family:'宋体';font-size:14px;line-height:26px;" >
    <i ng-if="!node._loading" ng-click="node._open ? close(node) : open(node)"
       ng-style="{'visibility': node.isLast == 'false' ? 'visible' : 'hidden'}"
       ng-class="{'glyphicon-minus-sign': node._open, 'glyphicon-plus-sign': !node._open}"
       class="glyphicon" style="cursor: pointer;color: #959393;"></i>
    <img ng-if="node._loading" ng-src="{{contextServer}}/ct/img/loadnodes.gif"/>
    <span style="cursor: pointer"
          ng-style="{'background-color' : (node == treeDialogView.selectedNode) ? 'darkgray': 'white', 
          'padding' : (node == treeDialogView.selectedNode) ? '5px': '0',
          'color': (node == treeDialogView.selectedNode) ? 'white' : 'black'}"
          ng-click="selected(node)" ng-dblclick="dbSelected(node)">
        {{node.name}}
    </span>
    <li ng-repeat="node in node._children" ng-if="isVisible(node)" ng-include="contextServer + '/ct/js/tpl/tree.node.jsp'"></li>
</ol>