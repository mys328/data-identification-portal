<%--
  Created by IntelliJ IDEA.
  User: luohui
  Date: 2017/3/23
  Time: 9:59
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<html>
<head>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css">
    <title>天讯数据-产品信息</title>
</head>
<body>
<h3>产品列表-API</h3>
<ul class="list-group">
    <c:forEach items="${productList}" var="product">
        <li class="list-group-item">
            <a href="##">产品名称：${product.productName}，计费方式：${product.chargeType}，单价：${product.unitPrice}元/${product.unit}</a>
        </li>
    </c:forEach>
</ul>
</body>
<script>
    jQuery.submit();
</script>

<script src="<%=request.getContextPath()%>/resource/js/jquery.js"></script>
<script src="<%=request.getContextPath()%>/resource/bootstrap/js/bootstrap.min.js"></script>
</html>
