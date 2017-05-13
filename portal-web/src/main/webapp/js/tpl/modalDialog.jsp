<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Max-Age", "60");
%>
<div class="modal fade">
    <div class="modal-dialog {{modalSize ? modalSize : ''}}" ng-style="{'width': contentWidth}">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">{{modalTitle}}</h4>
            </div>
            <div class="modal-body">
                <div ng-transclude></div>
            </div>
            <div ng-show="showFooter" class="modal-footer">
                <button ng-disabled="disabledConfirm" type="button" class="btn btn-default"><i class="fa fa-check"></i> {{confirmButton}}</button>
            </div>
        </div>
    </div>
</div>