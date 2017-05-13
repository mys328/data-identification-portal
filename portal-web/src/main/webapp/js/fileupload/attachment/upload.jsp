<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@page import="com.paas.ct.CtCommon" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="<%=request.getContextPath() %>/attachment/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/attachment/ajaxfileupload.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/attachment/upload.file.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/attachment/jquery.showLoading.js"></script>
 <link rel="stylesheet" type="text/css" href="../css/showLoading.css">
     <link rel="stylesheet" type="text/css" href="../css/bootstrap.css">
    <!--fonts CSS-->
    <link rel="stylesheet" type="text/css" href="../css/font-awesome.css">
    <link rel="stylesheet" type="text/css" href="../css/layout.css">
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <link rel="stylesheet" href="../css/showDialog.css" />
 
<script type="text/javascript">
var url='<%=CtCommon.domainUrl%>';
var portct='<%=CtCommon.portCt%>';
var protocol='<%=CtCommon.protocol%>'; 
document.domain = url;
	$(function(){
		$.bindFileUploadEvent({uploadAttachment:"#load1",basePath:protocol+url+":"+portct,attachmentArea:$("#attachmentArea"),attachmentSystemCode:"pm",attachmentSystemtype:"qc"});
	$("#save").click(function() {
		//upload.file.js里面封装URL的方法调用
		 var url=setFileUrl("<%=request.getContextPath() %>/app/save.do?attachmentSystemCode=tm & attachmentSystemtype=qc");
		 $("#fileSaveForm").attr("action", url);
		 $('#fileSaveForm').submit();
		})
	});
	
	
</script>
<title>Insert title here</title>
</head>
<body>
<div id="activity_pane">
<input type="button" value="上传" id="load1" /> 
<a>附件所属项目(此DEMO默认是项目类型为：合同管理(编码为tm)，附件所属项目类型为：合同起草(qc))</a>
<a>此例中的编码类型为演示数据，具体类型编码请参照需求文档</a>

<form action="<%=request.getContextPath() %>/app/save.do" method="post" id="fileSaveForm"></form>
<!--  <input type="button"  value="保存" id="save">-->
<div id="attachmentArea"></div>

<div>
	
</div>
</div>
<!-- <a href="<%=request.getContextPath() %>/app/downAttachment.do?attachmentId=d846a538-4b2e-45f3-992c-6d79d21e5caf">下载</a>
 -->
 
 </div>
</body>
</html>