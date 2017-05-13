<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "GET");
	response.setHeader("Access-Control-Max-Age", "60");
%>
<div class="zt-search">
    <div class="ser_tit">
        <div class="title">基本信息</div>
    </div>
    <div class="msg_content">
        <table class="table-detail table-detail-no">
	            <tr>
                <td class="td-left">设计文件名称：</td>
                <td>
                    <input type="text" name="subject" ng-model="view.projectData.schName" class="inputText_lg" disabled />
                    <span class="btn-choose" ng-if="view.fascicle == true && ( view.projectId != null && view.projectId != undefined && view.projectId != '')" >
                    	<a ng-click="view.fascicleDialog=true" class="btn btn-default">选 择</a>
                    </span>
                    <span class="btn-choose" ng-if="view.fascicle == false" >
                    	当前项目没有分册
                    </span>
                    <span class="btn-choose" ng-if="!( view.projectId != null && view.projectId != undefined && view.projectId != '')" >
                    	请选择项目
                    </span>
                </td>
                <td class="td-left">设计文件编号：</td>
                <td class="td-center-width">
                    <input type="text" name="subject" ng-model="view.projectData.schCode" class="inputText_lg" disabled />
                </td>
            </tr>
            <tr>
                <td class="td-left">计划完成时间：</td>
                <td>
                    <input type="text" name="subject" ng-value="view.projectData.schEndTime | date : 'yyyy-MM-dd'"  class="inputText_lg" disabled />
                </td>
                <td class="td-left"><em>*</em>结果录入时间：</td>
                <td class="td-center-width">
                   <input type="text" id="ddd" name="subject" ng-model="view.resultInputTime" date-picker class="inputText_lg" />
                   <span class="btn-choose" onclick="WdatePicker({el:'ddd'})">
	                   <a class="btn btn-default btn-rl">
	                   		<i class="fa fa-calendar"></i>
	                   </a>
                   </span>
                </td>
            </tr>
            <tr>
                <td class="td-left">提交人：</td>
                <td colspan="3">
                    <input type="text" name="subject" ng-model="view.userName" value="自动载入登录人" class="inputText_lg" disabled />
                </td>
            </tr>
            <tr>
                <td ng-show="view.delayReasons" class="td-left"><em>*</em>延期原因：</td>
                <td ng-show="view.delayReasons" colspan="3">
                    <textarea cols="55" rows="5" type="text" name="subject" ng-model="view.delayReason" value="自动载入登录人"  />
                </td>
            </tr>
            
        </table> 
    </div>
</div>
<div option-fascicle-dialog 
     show-dialog="view.fascicleDialog"
     modal-title="项目分册信息"
     confirm-button="确定"
     sch-code="schCode"
     project-id="view.projectId"
     fc-schid="fcSchid"
     projectData="view.projectData"
     on-selected-confirm="selectProject(draft)">
