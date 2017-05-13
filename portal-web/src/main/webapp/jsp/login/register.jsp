<%--
  Created by IntelliJ IDEA.
  User: luohui
  Date: 2017/3/22
  Time: 15:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resource/css/reset.css"/>
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resource/css/register.css"/>

    <title>天讯数据-注册</title>
</head>
<body>

<canvas id="regId"></canvas>
<div id="regHeader">
    <a href="/" target="_blank">
        <div>天讯首页</div>
    </a>
    <div class="tianxun_login">
        已有天讯帐号，<a href="/login" target="_blank">直接登录</a><img src="<%=request.getContextPath()%>/resource/image/arrow.png">
    </div>
</div>

<div id="regContent">
    <div class="reg_content">
        <form name="registerForm" id="mobileForm" action="/register/registProcess" method="post" class="regForm"
              autocomplete="off" onsubmit="return false;">
            <div class="reg_desc">
                <div class="reg_desc_big mobile">手机注册</div>
                <div class="reg_desc_small mail">or 邮箱注册</div>
            </div>
            <div class="reg_input">
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="text" class="regInput" name="username" value="" id="username"
                               placeholder="用户名（6-24位字母数字）" autocomplete="off" tabindex="1"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>昵称需在6-24位字母数字间</em></span>
                    </p>
                </div>
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="tel" class="regInput" name="mobilephone" value="" id="mobilephone"
                               placeholder="手机号码" autocomplete="off" tabindex="2"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请输入正确的手机号</em></span>
                    </p>
                </div>
                <div class="reg_input_para code loginListCode" style="display:none">
                    <div class="reg_border" style="bottom:-8px;"></div>
                    <input type="text" class="regInput" name="captcha" id="captcha" value="" placeholder="计算结果"
                           autocomplete="off" tabindex="3"/>
                    <img src="/vercode?1490234634" id="vercodeImg" alt=""/>
                    <a href="javascript:;" class="getImg" id="captchaimg">&nbsp;</a>
                    <span class="errorTips" style="margin-left: 25px"><i class="iconfont">
                        &#xe610;</i><em>图片验证码有误</em></span>
                </div>
                <div class="reg_input_para code">
                    <div class="reg_border"></div>
                    <p>
                        <input type="text" class="regInput" name="codeNum" value="" id="codeNum" placeholder="手机验证码"
                               autocomplete="off" tabindex="3"/>
                        <input type="button" class="smsbtn" type="button" value="发送验证码"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>验证码有误</em></span>
                        <input type="hidden" name="JUHE_TOKEN" value="B0379C14AA8FBBB272CC6AF2B98464705AA4D0DC">
                    <p>
                </div>
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="password" class="regInput" name="password" value="" id="password"
                               placeholder="密码（不少于6位）" autocomplete="off" tabindex="4"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请输入大于6位的密码</em></span>
                    </p>
                </div>
                <div class="reg_input_para">
                    <p class="reg_ckeckbox">
                        <input type="checkbox" name="isRead" value="1" checked="checked" id="checked" class="checked"/>
                        <label for="checked" class="iconfont"></label>
                        &nbsp;我已阅读并接受<a href="/legal" target="_blank">《天讯用户服务协议》</a>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请接受天讯用户服务协议</em></span>
                    </p>
                    <p>
                        <input type="hidden" name="type" value="1">
                        <input type="button" class="regBtn" id="mobileRegBtn" value="注册">
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>系统异常</em></span>
                    </p>
                </div>
            </div>
        </form>
        <form name="registerForm" id="mailForm" action="/register/registProcess" method="post" class="regForm"
              autocomplete="off" onsubmit="return false;">
            <div class="reg_desc">
                <div class="reg_desc_big mail">邮箱注册</div>
                <div class="reg_desc_small mobile">or 手机注册</div>
            </div>
            <div class="reg_input">
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="text" class="regInput" name="username" value="" id="mailUsername"
                               placeholder="用户名（6-24位字母数字）" autocomplete="off" tabindex="1"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>昵称需在6-24位字母数字间</em></span>
                    </p>
                </div>
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="tel" class="regInput" name="email" value="" id="mail" placeholder="你的常用邮箱"
                               autocomplete="off" tabindex="2"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请输入有效的邮箱地址</em></span>
                    </p>
                </div>
                <div class="reg_input_para">
                    <div class="reg_border"></div>
                    <p>
                        <input type="password" class="regInput" name="password" value="" id="mailPassword"
                               placeholder="密码（不少于6位）" autocomplete="off" tabindex="4"/>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请输入大于6位的密码</em></span>
                    </p>
                </div>
                <div class="reg_input_para">
                    <p class="reg_ckeckbox">
                        <input type="checkbox" name="isRead" value="1" checked="checked" id="mailChecked"
                               class="checked"/>
                        <label for="mailChecked" class="iconfont"></label>
                        &nbsp;我已阅读并接受<a href="/legal" target="_blank">《天讯用户服务协议》</a>
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>请接受天讯用户服务协议</em></span>
                    </p>
                    <p>
                        <input type="hidden" name="type" value="1">
                        <input type="button" class="regBtn" id="mailRegBtn" value="注册">
                        <span class="errorTips"><i class="iconfont">&#xe610;</i><em>系统异常</em></span>
                    </p>
                </div>
            </div>
        </form>
    </div>

</div>
<div id="regCircle"></div>
</body>

<script src="<%=request.getContextPath()%>/resource/js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/layer.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/json.parse.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/jquery.form.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/regPublic.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/nslog.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=request.getContextPath()%>/resource/js/regAnimation.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
    var window_width = $(window).width();
    var window_height = $(window).height();

    function regAnimation() {

        var $ele = $('#regId');

        if ($ele[0].getContext) {
            $('#regId').regAnimation({
                window_width: window_width,
                window_height: window_height,
                window_background: '#fff',
                star_count: '100',
                star_color: '#02c5ff',
                star_depth: '600'
            });
        }
    }

    $(function () {
        $('#regCircle').height(window_height - 330).fadeIn(function () {
            regAnimation();
        });
    });
</script>


<script type="text/javascript">

    var typeArray = [true, true];
    var statusArray = [true, true, true, true, true, true, true];
    var checkArray = [true, true, true, true, true, true, true];
    var errorArray = [true, true];
    var mailStatusArray = [true, true, true, true, true, true, true];
    var mailCheckArray = [true, true, true, true, true, true, true];
    var mailErrorArray = [true, true];
    var type = 0;
    var token = getToken();

    function getToken() {
        return (generateMixed(6) + 'JhCN04');
    }

    function generateMixed(n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = '';
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }

    function init() {
        initEvent();
    }

    function initData() {
        $('#username').val('');
        $('#mobilephone').val('');
        $('#codeNum').val('');
        $('#password').val('');
        $('#mailUsername').val('');
        $('#mail').val('');
        $('#mailPassword').val('');
        $('#checked')[0].checked = true;
        $('#mailChecked')[0].checked = true;
        $('.errorTips').hide();
    }

    function initDom() {
        var top = ($(window).height() - 340) / 2 - 120;
        var left = ($(window).width() - 900) / 2;
        $('.reg_content').css({
            'top': top,
            'left': left
        }).fadeIn(initDo);
    }

    function initEvent() {

        $('.reg_content').on('click', '.mobile', function () {

            if (typeArray[0] === true) {
                nslog(1000);
                typeArray[0] = false;
            }

            type = 0;

            initData();
            $('#mobileForm .reg_border:eq(0)').addClass('hover');
            $('#mailForm').hide();
            $('#mobileForm').show();
        });

        $('.reg_content').on('click', '.mail', function () {

            if (typeArray[1] === true) {
                nslog(1030);
                typeArray[1] = false;
            }

            type = 1;

            initData();
            $('#mailForm .reg_border:eq(0)').addClass('hover');
            $('#mobileForm').hide();
            $('#mailForm').show();
        });

        $('.reg_content').on('focus', '.regInput', function () {
            $('.reg_border').removeClass('hover');
            $(this).closest('.reg_input_para').find('.reg_border').addClass('hover');
        });

        $(window).on('resize', initDom);
        $(document).on('ready', initDom);

        $(document).on('keydown', function (e) {

            if (e.keyCode === 13) {

                type ? $('#mailRegBtn').click() : $('#mobileRegBtn').click();

            }
        });

        initMobileEvent();
        initMailEvent();
    }

    function initMobileEvent() {
        $('#username').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var username = $.trim(ele.val());

            if (statusArray[0] === true) {
                nslog(1001);
                statusArray[0] = false;
            }

            if (!isRegisterUserName(username)) {
                showError('昵称需在6-24位字母数字间', ele);
            } else {
                $.ajax({
                    url: '/util/checkUsed',
                    type: 'post',
                    data: 'token=' + token + '&username=' + username,
                    dataType: 'json',
                    success: function (obj) {
                        if (obj.code === '0') {
                            if (checkArray[0] === true) {
                                nslog(1002);
                                checkArray[0] = false;
                            }
                            errorDom.find('em').html('');
                            errorDom.hide();
                        } else if (obj.code === '-1') {
                            showError('该用户名已经存在', ele);
                        }
                    }
                });
            }
        });

        $('#mobilephone').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var mobilephone = $.trim(ele.val());

            if (statusArray[1] === true) {
                nslog(1003);
                statusArray[1] = false;
            }

            if (!isPhone(mobilephone)) {
                showError('请输入正确的手机号', ele);
            } else {
                nslog(1010, '/register', {
                    content: mobilephone
                });

                if (checkArray[1] === true) {
                    nslog(1004);
                    checkArray[1] = false;
                }

                errorDom.find('em').html('');
                errorDom.hide();
            }

        });

        $('#codeNum').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var codeNum = $.trim(ele.val());

            if (statusArray[0] === false && statusArray[1] === false && statusArray[2] === false && statusArray[3] === true) {
                nslog(1009);
                statusArray[3] = false;
            }
        });

        $('#password').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var userPass = $.trim(ele.val());

            if (statusArray[4] === true) {
                nslog(1011);
                statusArray[4] = false;
            }


            if (userPass.length < 6) {
                showError('请输入大于6位的密码', ele);
            } else {

                if (checkArray[4] === true) {
                    nslog(1012);
                    checkArray[4] = false;
                }

                errorDom.find('em').html('');
                errorDom.hide();
            }

        });

        // 点击发送短信按钮时
        $('.smsbtn').click(function () {
            $('.errorTips').find('em').html('');
            $('.errorTips').hide();
            $('.smsbtn').prop("disabled", true);
            var mobilephone = $('#mobilephone').val().trim();
            var username = $('#username').val().trim();
            var captcha = $('#captcha').val().trim();
            if (!isRegisterUserName(username)) {
                showError('昵称需在6-24位字母数字间', $('#username'), true);
                $('.smsbtn').prop('disabled', false);
            } else if (!isPhone(mobilephone)) {
                showError('请输入正确的手机号', $('#mobilephone'), true)
                $('.smsbtn').prop('disabled', false);
            } else if (0 && captcha == '') {
                showError('图片验证码有误', $('#captcha'), true)
                $('.smsbtn').prop('disabled', false);
            } else {
                if (statusArray[2] === true) {
                    nslog(1005);
                    statusArray[2] = false;
                }
                $('.smsbtn').val('验证码发送...').prop('disabled', true);
                $.post('/register/sendsms', {
                    'j9af1fe7519b7af035b1dfb8687b51d68h7217': mobilephone,
                    'j5f95b7a4fdc89ce1cff6d6437b8d7e10h3952': username,
                    'je3b73da8bf950f3044f5f246c30770a1h9789': captcha,
                    'j00f5dcf886c8dd74a329bdf4d52b5421h5627': $(':input[name="JUHE_TOKEN"]').val()
                }, function (e) {
                    var o = json_parse(e);
                    if (o.code == '1') {
                        if (checkArray[2] === true) {
                            nslog(1006);
                            checkArray[2] = false;
                        }
                        resetSmsBtn(120);
                    } else {
                        if (errorArray[0] === true) {
                            nslog(1007, '/register', {
                                content: o.info
                            });
                            errorArray[0] = false;
                        }
                        nslog(1008, '/register', {
                            content: o.info
                        });
                        if (o.code == '-4') //用户名验证
                        {
                            showError(o.info, $('#username'), true);
                        } else if (o.code == '-1') //手机号错误或被用过
                        {
                            showError(o.info, $('#mobilephone'), true);
                        } else if (o.code == '-3') //手机号错误或被用过
                        {
                            showError(o.info, $('#codeNum'), true);
                        } else if (o.code == '-100' || o.code == '-2') { //出现系统级别错误单独显示
                            showError(o.info, $('#mobileRegBtn'), true);
                        } else if (o.code == '-99') {
                            $("#captchaimg").click();
                            showError(o.info, $('#captcha'), true);

                        }
                        $('.smsbtn').val('获取验证码').prop("disabled", false);
                    }
                })
            }
        });

        //验证码刷新
        $("#captchaimg").click(function () {
            $("#vercodeImg").attr('src', '/vercode?' + new Date().getTime());
        })
        // 点击注册按钮时
        $('#mobileRegBtn').click(function () {

            var userName = $('#username').val();
            var mobilephone = $('#mobilephone').val();
            var userPass = $('#password').val();
            var codeNum = $('#codeNum').val();

            userName = $.trim(userName);
            mobilephone = $.trim(mobilephone);
            userPass = $.trim(userPass);

            $(this).val('注册中...').prop('disabled', true);
            $('.errorTips').find('em').html('');
            $('.errorTips').hide();


            if (!isRegisterUserName(userName)) {
                showError('昵称需在6-24位字母数字间', $('#username'), true);
                $(this).val('注册').removeAttr('disabled');
            } else if (!isPhone(mobilephone)) {
                showError('请输入正确的手机号', $('#mobilephone'), true);
                $(this).val('注册').removeAttr('disabled');
            } else if (codeNum == '') {
                showError('验证码有误', $('#codeNum'), true);
                $(this).val('注册').removeAttr('disabled');
            } else if (userPass.length < 6) {
                showError('请输入大于6位的密码', $('#password'), true);
                $(this).val('注册').removeAttr('disabled');
            } else if (!$('#checked').is(":checked")) {
                if (statusArray[6] === true) {
                    nslog(1017);
                    statusArray[6] = false;
                }
                showError('请接受聚合用户服务协议', $('#checked'), true);
                $(this).val('注册').removeAttr('disabled');
            } else { //基础验证通过
                if (statusArray[5] === true) {
                    nslog(1013);
                    statusArray[5] = false;
                }
                $('#mobileForm').ajaxSubmit(function (e) {
                    var obj = json_parse(e);
                    var code = obj.code;
                    var info = obj.info;

                    if (code == '1') {
                        if (checkArray[5] === true) {
                            nslog(1014);
                            checkArray[5] = false;
                        }
                        layer.msg(info, {
                            icon: 1,
                            time: 1500
                        }, function () {
                        });
                        setTimeout(function () {
                            window.location.href = '/login/index/status/success'
                        }, '1500');
                    } else {
                        if (errorArray[1] === true) {
                            nslog(1015, '/register', {
                                content: info
                            });
                            errorArray[1] = false;
                        }
                        nslog(1016, '/register', {
                            content: info
                        });
                        if (code == '-1') {
                            showError(info, $('#username'), true);
                        } else if (code == '-2') {
                            showError(info, $('#mobilephone'), true);
                        } else if (code == '-3') {
                            showError(info, $('#codeNum'), true);
                        } else if (code == '-4') {
                            showError(info, $('#password'), true);
                        } else if (code == '-100') {
                            showError(info, $('#mobileRegBtn'), true);
                        }
                        $('#mobileRegBtn').val('注册').prop('disabled', false);
                    }

                })
            }
        });
    }

    function initMailEvent() {
        $('#mailUsername').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var username = $.trim(ele.val());

            if (mailStatusArray[0] === true) {
                nslog(1031);
                mailStatusArray[0] = false;
            }

            if (!isRegisterUserName(username)) {
                showError('昵称需在6-24位字母数字间', ele);
            } else {

                $.ajax({
                    url: '/util/checkUsed',
                    type: 'post',
                    data: 'token=' + token + '&username=' + username,
                    dataType: 'json',
                    success: function (obj) {
                        if (obj.code === '0') {
                            if (mailCheckArray[0] === true) {
                                nslog(1002);
                                mailCheckArray[0] = false;
                            }
                            errorDom.find('em').html('');
                            errorDom.hide();
                        } else if (obj.code === '-1') {
                            showError('该用户名已经存在', ele);
                        }
                    }
                });
            }

        });

        $('#mail').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var email = $.trim(ele.val());

            if (mailStatusArray[1] === true) {
                nslog(1033);
                mailStatusArray[1] = false;
            }

            if (!isEmail(email)) {
                showError('请输入有效的邮箱地址', ele);
            } else {
                nslog(1034, '/email', {
                    content: email
                });

                if (mailCheckArray[1] === true) {
                    nslog(1035);
                    mailCheckArray[1] = false;
                }

                errorDom.find('em').html('');
                errorDom.hide();
            }
        });

        $('#mailPassword').on('blur', function () {

            var ele = $(this);
            var errorDom = ele.siblings('.errorTips');
            var userPass = $.trim(ele.val());

            if (mailStatusArray[2] === true) {
                nslog(1036);
                mailStatusArray[2] = false;
            }

            if (userPass.length < 6) {
                showError('请输入大于6位的密码', ele);
            } else {

                if (mailCheckArray[2] === true) {
                    nslog(1037);
                    mailCheckArray[2] = false;
                }

                errorDom.find('em').html('');
                errorDom.hide();
            }
        });

        $('#mailRegBtn').click(function () {

            var userName = $('#mailUsername').val();
            var email = $('#mail').val();
            var userPass = $('#mailPassword').val();

            userName = $.trim(userName);
            userPass = $.trim(userPass);
            email = $.trim(email);

            $(this).val('注册中...').prop('disabled', true);
            $('.errorTips').find('em').html('');
            $('.errorTips').hide();

            if (!isRegisterUserName(userName)) {
                showError('昵称需在6-24位字母数字间', $('#mailUsername'), true);
            } else if (!isEmail(email)) {
                showError('请输入有效的邮箱地址', $('#mail'), true);
            } else if (userPass.length < 6) {
                showError('请输入大于6位的密码', $('#mailPassword'), true);
            } else if (!$('#mailChecked').is(":checked")) {
                if (mailStatusArray[3] === true) {
                    nslog(1038);
                    mailStatusArray[3] = false;
                }
                showError('请接受聚合用户服务协议', $('#mailChecked'), true);
            } else { //基础验证通过
                if (mailStatusArray[4] === true) {
                    nslog(1039);
                    mailStatusArray[4] = false;
                }
                $('#mailForm').ajaxSubmit(function (e) {
                    var obj = json_parse(e);
                    var code = obj.code;
                    var info = obj.info;

                    if (code == '1') {
                        if (mailCheckArray[4] === true) {
                            nslog(1040);
                            mailCheckArray[4] = false;
                        }
                        window.location.href = obj.acturl;
                    } else {
                        if (mailErrorArray[0] === true) {
                            nslog(1041, '/email', {
                                content: info
                            });
                            mailErrorArray[0] = false;
                        }
                        nslog(1042, '/email', {
                            content: info
                        });
                        if (code == '-2') {
                            showError(info, $('#mail'), true);
                        } else if (code == '-4') {
                            showError(info, $('#mailPassword'), true);
                        } else if (code == '-100') {
                            showError(info, $('#mailRegBtn'), true);
                        } else if (code == '-1') {
                            showError(info, $('#mailUsername'), true);
                        }
                        $('#mailRegBtn').val('注册').prop('disabled', false);
                    }
                })
            }
        });
    }

    function showError(msg, selector, isFocus) {
        selector.closest('p').find('.errorTips').find('em').html(msg)
        selector.closest('p').find('.errorTips').fadeIn();
        $('.regBtn').val('注册').prop('disabled', false);

        if (isFocus) {
            selector.focus();
        }
    }

    function initDo() {
        $('.mobile').click();
    }

    // 重置短信发送按钮
    function resetSmsBtn(index) {
        var init = setInterval(function () {
            index--;
            if (index <= 0) {
                clearInterval(init);
                $('.smsbtn').val('获取验证码').css({
                    'background': '#2AABE4'
                }).prop('disabled', false);
            } else {
                $('.smsbtn').val('重新发送(' + index + ')').prop('disabled', true);
            }
        }, 1000);
    }

    init();
</script>


</html>
