<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css">
    <title>天讯认证平台</title>
</head>

<body>
<div class="navbar navbar-default" role="navigation">
    　<div class="navbar-header">
    　    <a href="##" class="navbar-brand">天讯认证</a>
    　</div>
    <ul class="nav navbar-nav">
        <li class="active"><a href="http://www.tisson.cn/index">网站首页</a></li>
        <li><a href="product/productInfoList.do">API</a></li>
        <li><a href="login.do">会员中心</a></li>
        <li><a href="##">成功案例</a></li>
        <li><a href="##">关于我们</a></li>
    </ul>
    <form action="##" class="navbar-form navbar-left" rol="search">
        <div class="form-group">
            <input type="text" class="form-control" placeholder="请输入关键词" />
        </div>
        <button type="submit" class="btn btn-default">搜索</button>
    </form>
</div>
<div class="container">
    <div class="row">
        <div>
            <a href="#" class="thumbnail">
                <img alt="100%x100%" src="<%=request.getContextPath()%>/resource/image/wxbg.png" style="height: 60%; width: 100%; display: block;" >
            </a>
        </div>
        <div>
            <a href="#" class="thumbnail">
                <img alt="100%x100%" src="<%=request.getContextPath()%>/resource/image/wxstep.png" style="height: 20%; width: 100%; display: block;" >
            </a>
        </div>
    </div>
</div>
<script src="<%=request.getContextPath()%>/resource/js/jquery.js"></script>
<script src="<%=request.getContextPath()%>/resource/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>
