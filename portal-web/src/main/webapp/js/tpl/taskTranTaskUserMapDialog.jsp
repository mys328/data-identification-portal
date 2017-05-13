
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
     on-close="close()"
     on-confirm="onSelected()">

    <div class="zt-toolbar">
      <div class="">
        <button type="button" class="btn btn-default confirm-button" ng-show="showUser"><i class="fa fa-check"></i> 确 定</button>
        <button type="button" class="btn btn-default" ng-show="showDef"  ng-click="selectDef()"><i class="fa fa-check"></i> 确 定</button>
      </div>
    </div>
    <div class="block10"></div>
    <br>
    <div>
	<table class="table table-bordered table-striped table-hover" id="{{dialogId}}-TaskList">
		<thead>
			<tr ng-if="showUser">
				<th height="28" ng-if="selectPath == 1">执行路径</th>
				<th height="28" style="min-Width:150px;">下一步任务</th>
				<th height="28" ng-if="canChoicePath">选择同步条件后的执行路径</th>
				<th>下一步审批人员</th>
			</tr>
			<tr ng-if="showDef">
				<th height="28" width="20%">选择</th>
				<th height="28">流程定义名称</th>
			</tr>
		</thead>
		<tbody ng-if="showDef">
			<tr ng-repeat="def in defs">
				<td style="text-align:center"><input type="radio" name="actDefId" value="{{def.actDefId}}" ng-click="checkDef(def.actDefId)"></td>
				<td style="text-align:center">{{def.subject}}</td>
			</tr>
		</tbody>
		<tbody ng-repeat="nodeTranUser in nodeTranUserList" ng-if="nodeTranUserList">
			<tr ng-if="!(nodeTranUser.nodeUserMapSet && nodeTranUser.nodeUserMapSet.length > 0)">
				<td height="28" width="18%" nowrap="nowrap" rowspan="1" style="vertical-align:middle;"  ng-if="selectPath == 1">
						<input type="radio" name="destTask" value="{{nodeTranUser.nodeId}}" ng-checked="($index + 1) == 1" />
					{{nodeTranUser.nodeName}}<!-- 跳转的目标节点 -->
					<input type="hidden" name="isEnd" id="isEnd" value="1"/>
				</td>
				<td  >  没有找到后续任务。</td> 
				<td>   </td>
			</tr>
			<tr ng-repeat="nodeUserMap in nodeTranUser.nodeUserMapSet" ng-if="(nodeTranUser.nodeUserMapSet && nodeTranUser.nodeUserMapSet.length > 0)">
				<td height="28" width="18%" nowrap="nowrap" rowspan="{{nodeTranUser.nodeUserMapSet}}"
					style="vertical-align:middle;" ng-if="(selectPath == 1) && (($index + 1) == 1)">
					<input type="radio" name="destTask" ng-value="nodeTranUser.nodeId" ng-click="getTaskNode(nodeTranUser.nodeId)"
						ng-checked="nodeTranUserList[0].nodeId == nodeTranUser.nodeId" />
					{{nodeTranUser.nodeName}}<!-- 跳转的目标节点 -->
				</td>
				<td>
					<input type="checkbox" name="nextPathId" ng-model="nodeUserMap.nodeId" ng-if="canChoicePath"/>
					{{nodeUserMap.nodeName}}
				</td>
				<td>
					<div>
						<input type="hidden" name="lastDestTaskId" value="{{nodeUserMap.nodeId}}"/>
						<table class="table table-bordered table-striped table-hover" ng-if="userSelectType != 4">
							<tr ng-repeat="executor in nodeUserMap.taskExecutors">
								<td width="20%">
									<span ng-if="executor.type == 'user'">用户</span>
									<span ng-if="executor.type != 'user'">{{executor.executor}}</span>
								</td>
								<td>
									<span style="width:120px;display:inline-block;" class="userSpan"
										ng-repeat="executorUser in exeutorToUserMap[nodeUserMap.nodeId][executor.executeId]">
										<input class="executor" name="{{nodeUserMap.nodeId}}_userId" type="radio" checked="checked"
											id="{{nodeUserMap.nodeId + executor.type}}_{{executorUser.executeId}}" isMultipleInstance="{{isMultipleInstance = nodeUserMap.isMultipleInstance}}"
											value="{{executorUser.type}}^{{executorUser.executeId}}^{{executorUser.executor}}"
											ng-if="userSelectType==1 && !nodeUserMap.isMultipleInstance" ng-model="formData[nodeUserMap.nodeId]"/>{{executorUser.userId}}
											
										<input class="executor" name="{{nodeUserMap.nodeId}}_userId" type="checkbox" 
											id="{{nodeUserMap.nodeId + executor.type}}_{{executorUser.executeId}}" 
											value="{{executorUser.type}}^{{executorUser.executeId}}^{{executorUser.executor}}"
											ng-if="userSelectType==1 && nodeUserMap.isMultipleInstance" ng-checked="formDataByRadio[executor.executeId] == executorUser.type +^+ executorUser.executeId +^+ executorUser.executor"
											ng-model="formData[executor.executeId]" ng-true-value="{{executorUser.type}}^{{executorUser.executeId}}^{{executorUser.executor}}" ng-false-value="false"/>

										<input class="executor" name="{{nodeUserMap.nodeId}}_userId" type="checkbox" checked="checked"
											id="{{nodeUserMap.nodeId + executor.type}}_{{executorUser.executeId}}"
											value="{{executorUser.type}}^{{executorUser.executeId}}^{{executorUser.executor}}"
											ng-if="userSelectType==2"/>

										<input class="executor" name="{{nodeUserMap.nodeId}}_userId" type="hidden"
											id="{{nodeUserMap.nodeId + executor.type}}_{{executorUser.executeId}}" actnodeid="{{nodeUserMap.nodeId}}"
											value="{{executorUser.type}}^{{executorUser.executeId}}^{{executorUser.executor}}"
											ng-if="userSelectType==3"/>
										<label for="{{nodeUserMap.nodeId + executor.type}}_{{executorUser.executeId}}">&nbsp;{{executorUser.executor}}</label>
									</span>
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
    </div>
    <div mask visible="showMask" ref-id="<%= '#' %>{{dialogId}}-TaskList"></div>
</div>
