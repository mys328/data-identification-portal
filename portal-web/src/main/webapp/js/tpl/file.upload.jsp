<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<div class="add_file">
    <table class="table-detail table-detail-no">
                <tr ng-repeat="item in view.projectDocs">
                    <!-- 附件详情-->
                    <td>
                        <span ng-if="item.docId">
	                        <em ng-if="item.isRequired==1">*</em>
	                        <em ng-if="item.isRequired!=1">&nbsp</em>
	                        <select class="form-control-select-lg " style="width: 120px;" disabled>
	                            <option value="">--请选择--</option>
	                            <option ng-repeat="doc in showView.docType" ng-selected="doc.typeInstId == item.confId">{{doc.typeName}}</option>
	                        </select>
	                        <span class="btn-choose" style="margin-left: 10px;width:271px;display:inline-block; ">
	                            <a href="{{item.attPath}}" ng-if="item.type  == 1" target="view_window" >
	                            	<font size="3">{{item.docName.length > 18 ?item.docName.substr(0,18)+"..." : item.docName}}</font>
	                            </a>
	                             <a href="{{showView.uploadUrl+'/paas/ct/file/downAttachment.do?attachmentId='+item.docId}}" ng-if="item.type != 1">
	                           		 <font size="3">{{item.docName.length > 18 ?item.docName.substr(0,18)+"..." : item.docName}}</font>
	                             </a>
	                        </span>	
	                        <span class="btn-choose" ng-click="removeUpload($index)" >
	                            <a class="btn btn-default" style="margin-left: 5px" ng-if="getIsModifyFile()"><i class="fa fa-times"></i> 删 除</a>
	                        </span>
                        </span>
                        <!--</td>-->
	                     <span ng-if="!item.docId">
	                     	<em ng-if="getMandatory(item)">*</em>
	                        <em ng-if="!getMandatory(item)">&nbsp</em>
	                         <select class="form-control-select-lg " style="width: 120px;" ng-model="item.confId">
	                             <option value="">请选择</option>
	                             <option ng-repeat="doc in showView.docType" value="{{doc.typeInstId}}" ng-selected="doc.typeInstId == item.confId">
	                                 {{doc.typeName}}
	                             </option>
	                         </select>
	                       		<input type="text" ng-model="item.docName"  placeholder="请选择需要上传的附件" class="inputText_lg" readonly="readonly">
                           <span class="btn-choose" style="display: inline;top: 0;">
	                           <button upload-file
	                                   proxy="showView.proxy"
	                                   base-path="showView.uploadUrl"
	                                   system-code="showView.activityType"
	                                   ng-show="item.confId"
	                                   on-uploaded="setUploadItem(item, uploadData)" style="display: inline"></button>
                            </span>
                            <span class="btn-choose" ng-click="removeUpload($index)" style="display: inline;">
                                <a class="btn btn-default" href="javascript:void(0);" ng-if="getIsModifyFile()"><i class="fa fa-times"></i> 删 除</a>
	                        </span>
	                    </span>
	                    
	                    
                    </td>
                </tr>
                
                
                <tr ng-if="getIsModifyFile() && (onlyOne != 'true')">
                	<td>
                	<em>&nbsp</em>
                		<span class="btn-choose" ng-click="addUpload()" ng-if="getIsModifyFile()" >
	                        <a class="btn btn-default" href="javascript:void(0);" ><i class="fa fa-plus"></i> 添 加</a>
	                    </span>
                	</td>
                </tr>
            </table>
</div>