/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.web.controller;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.identification.customer.service.api.response.CmsUserResDTO;
import com.identification.portal.service.LoginService;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author luohui
 * @version Id: LoginController.java, v 0.1 2017/3/22 10:50 luohui Exp $$
 */
@Controller
@RequestMapping("/login")
@Slf4j
public class LoginController {

    @Autowired
    private LoginService loginService;

    @RequestMapping()
    public String login(HttpServletRequest request, Model model) {
        String userCode = request.getParameter("userCode");
        String password = request.getParameter("password");
        String url = "/";
        if(StringUtils.isNotEmpty(userCode)){
            CmsUserResDTO cmsUserResDTO = loginService.userLogin(userCode);
            if(cmsUserResDTO == null){
                model.addAttribute("errorCode","00001");
                model.addAttribute("errorMsg","用户不存在!");
                url = "login/login";
            }else {
                if(!cmsUserResDTO.getLoginPassword().equals(password)){
                    model.addAttribute("errorCode","00002");
                    model.addAttribute("errorMsg","密码错误!");
                    url = "login/login";
                }else {
                    url = "product/productInfoList";
                }
            }

        }else{
            url = "login/login";
        }
        return url;
    }

    @RequestMapping(value = "/register")
    public String register(HttpServletRequest request, Model model){
        log.info("请求信息：{}",request.toString());

        return "login/register";
    }

}
