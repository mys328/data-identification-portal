/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.service.util;

import com.identification.common.exception.BaseException;
import com.identification.common.util.Result;
import com.identification.customer.service.api.exception.CustomerErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

/**
 * @author luohui
 * @version Id: PortalServiceExceptionUtils.java, v 0.1 2017/3/24 9:18 luohui Exp $$
 */
@Slf4j
public class PortalServiceExceptionUtils {

    /**
     * 1.统一异常处理
     *
     * @param err 异常
     * @return 外部响应对象
     */
    public static <T> Result<T> doExceptionService(Throwable err) {

        try {
            if (err instanceof BaseException) {
                BaseException e = (BaseException) err;
                return new Result<T>(e.getErrorCode().getCode(), StringUtils.isBlank(e
                        .getExtraMsg()) ? e.getErrorCode().getDesc() : e.getExtraMsg());
            }
            if (err instanceof IllegalArgumentException) {
                return new Result<T>(CustomerErrorCode.PARAMETER_VALID_ERROR.getCode(),
                        CustomerErrorCode.PARAMETER_VALID_ERROR.getDesc());
            }
        } catch (Exception e) {
            log.error("call ExceptionUtil doExceptionService：{}", e);
        }
        return new Result<T>(CustomerErrorCode.SYSTEM_INNER_ERROR.getCode(),
                CustomerErrorCode.SYSTEM_INNER_ERROR.getDesc());
    }
}
