<%--
  Created by IntelliJ IDEA.
  User: luohui
  Date: 2017/3/22
  Time: 10:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css">
    <title>天讯认证平台-会员中心</title>
</head>

<body>
<div>
    <div class="row">
        <div class="col-xs-6">
            <a href="#" class="thumbnail">
                <img src="<%=request.getContextPath()%>/resource/image/login.png"
                     style="height: 100%; width: 100%; display: block;">
            </a>
        </div>
        <div class="container col-xs-6">
            <form role="form" action="login">
                <div>
                    <ul class="h4" style="padding-left: 65%;padding-top: 10px;"><a href="/">认证首页</a></ul>
                </div>
                <div class="h1" style="padding-top: 30%;padding-left: 30%;padding-bottom: 20px">
                    <div style="float: left;">
                        <img src="<%=request.getContextPath()%>/resource/image/tisson.png"
                             style="height: 35px; width: 30px; display: block;">
                    </div>
                    <div>
                        天讯数据
                    </div>
                </div>

                <div class="form-group" style="padding-left: 20%;padding-right:20%;">
                    <img src="<%=request.getContextPath()%>/resource/image/pepole.png"
                         style="height: 22px; width: 30px; display: block;">
                    <input class="form-control" name="userCode" id="exampleInputEmail1" placeholder="用户名/手机号/邮箱">
                </div>
                <div class="form-group" style="padding-left: 20%;padding-right:20%;">
                    <img src="<%=request.getContextPath()%>/resource/image/password.png"
                         style="height: 22px; width: 30px; display: block;">
                    <input type="password" class="form-control" name="password" id="exampleInputPassword1"
                           placeholder="密码">
                </div>
                <div class="form-group" style="padding-left: 20%;padding-right:20%;color: red;">
                    ${errorMsg}
                </div>
                <div class="checkbox" style="padding-left: 65%">
                    <label>
                        <input type="checkbox"> 记住密码
                    </label>
                </div>
                <div style="padding-left: 20%;">
                    <button type="submit" class="btn loginBtn">登录</button>
                    <ul style="text-align: right;padding-right: 25%;padding-top: 10px;">还没有天讯账号,<a
                            href="login/register.do">立即注册</a></ul>
                </div>

            </form>
        </div>


    </div>
</div>

</body>
<style>
    .loginBtn {
        width: 75%;
        height: 40px;
        background: #03c5ff;
        border-radius: 2px;
        color: #fff;
        border: 0 none;
        letter-spacing: 4px;
        font-size: 16px;
    }
</style>
</html>
