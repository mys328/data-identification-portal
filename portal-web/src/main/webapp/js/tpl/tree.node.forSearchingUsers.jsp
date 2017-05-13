<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<ol style="list-style: none">
    <i ng-if="!node._loading" ng-click="node._open ? close(node) : open(node)"
       ng-style="{'visibility': node.isLast == 'false' ? 'visible' : 'hidden'}"
       ng-class="{'glyphicon-minus-sign': node._open, 'glyphicon-plus-sign': !node._open}"
       class="glyphicon" style="cursor: pointer"></i>
    <img ng-if="node._loading" ng-src="{{contextServer}}/ct/img/loadnodes.gif"/>
    <span style="cursor: pointer; font-size: 15px; font-weight:bold"
          ng-style="{'background-color' : (node == treeDialogView.selectedNode) ? 'darkgray': 'white', 'color': (node == treeDialogView.selectedNode) ? 'white' : 'black'}"
          >
        {{node.name}}
    </span>
    <li ng-repeat="user in node.users" style="cursor: pointer; overflow: auto; font-size: 10px; margin-left: 40px; padding-left: 0px;" ng-style="{'background-color' : (user == treeDialogView.selectedNode) ? 'darkgray': 'white', 'color': (user == treeDialogView.selectedNode) ? 'white' : 'black'}"  ng-click="selected(user)" ng-dblclick="dbSelected(user)" >-&nbsp;{{user.name}}</li>
    <li ng-repeat="node in node._children" ng-if="isVisible(node)" ng-include="contextServer + '/ct/js/tpl/tree.node.forSearchingUsers.jsp'"></li>
</ol>