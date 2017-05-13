/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.service.util;

import com.identification.common.util.Result;
import com.identification.customer.service.api.exception.CustomerServiceException;
import com.identification.portal.service.common.PortalErrorCode;
import lombok.extern.slf4j.Slf4j;

/**
 * @author luohui
 * @version Id: ResultUtil.java, v 0.1 2017/3/24 15:22 luohui Exp $$
 */
@Slf4j
public class ResultUtil {

    /**
     * 1.处理返回结果
     *
     * @param result 接口返回参数
     * @param <T>    返回信息
     */
    public static <T> void handlerResult(Result<T> result) {

        if (result == null) {
            log.error("远程调用响应为空");
            throw new CustomerServiceException(PortalErrorCode.REMOTE_SERVICE_INVOKE_FAIL);
        }
        if (!result.isSuccess()) {
            log.error("远程调用失败");
            throw new CustomerServiceException(PortalErrorCode.REMOTE_SERVICE_INVOKE_FAIL,
                    result.getErrorMsg());
        }
    }


}