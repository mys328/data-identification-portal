/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.service;

import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.identification.common.util.Result;
import com.identification.customer.service.api.UserManagerService;
import com.identification.customer.service.api.exception.CustomerServiceException;
import com.identification.customer.service.api.response.CmsUserResDTO;
import com.identification.portal.service.common.PortalErrorCode;
import com.identification.portal.service.util.ResultUtil;

/**
 * @author luohui
 * @version Id: LoginService.java, v 0.1 2017/3/24 9:15 luohui Exp $$
 */
@Slf4j
@Service
public class LoginService {

    @Autowired
    private UserManagerService userManagerService;

    public CmsUserResDTO userLogin(String userCode) {

        Result<CmsUserResDTO> result;

        try {
            log.info("用户名：{}", userCode);

            result = userManagerService.queryUserByCode(userCode, UUID.randomUUID().toString());

        } catch (Exception e) {
            log.error("查询用户异常！用户名：{}", userCode, e);
            throw new CustomerServiceException(PortalErrorCode.REMOTE_SERVICE_INVOKE_FAIL, e);
        }

        ResultUtil.handlerResult(result);
        log.info("用户名：{}，查询结果：{}",userCode,result);

        return result.getResult();
    }
}
