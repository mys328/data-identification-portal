/**
 * tisson.com.cn Inc.
 * Copyright (c) 2011-2017 All Rights Reserved.
 */
package com.identification.portal.service.common;

import com.identification.common.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author luohui
 * @version Id: PortalErrorCode.java, v 0.1 2017/3/24 15:18 luohui Exp $$
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum PortalErrorCode implements ErrorCode {

    REMOTE_SERVICE_INVOKE_FAIL("REMOTE_SERVICE_INVOKE_FAIL","远程调用失败");

    /**
     * 异常值
     */
    private String code;

    /**
     * 异常描述
     */
    private String desc;
}
