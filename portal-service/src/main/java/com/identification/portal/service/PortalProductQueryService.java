/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.service;

import java.util.List;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.identification.common.util.Result;
import com.identification.customer.service.api.exception.CustomerServiceException;
import com.identification.customer.service.api.query.ProductQueryService;
import com.identification.customer.service.api.request.ProductQueryReqDTO;
import com.identification.customer.service.api.response.ProductQueryResDTO;
import com.identification.portal.service.common.PortalErrorCode;
import com.identification.portal.service.util.ResultUtil;

/**
 * @author luohui
 * @version Id: PortalProductQueryService.java, v 0.1 2017/4/8 14:34 luohui Exp $$
 */
@Slf4j
@Service
public class PortalProductQueryService {

    @Autowired
    private ProductQueryService productQueryService;

    /**
     * 查询产品列表
     * @param productQueryReqDTO 产品请求参数
     * @return 产品列表
     */
    public List<ProductQueryResDTO> queryProductList(ProductQueryReqDTO productQueryReqDTO) {
        Result<List<ProductQueryResDTO>> result;

        try {

            log.info("查询产品的请求参数：{}", productQueryReqDTO);
            result = productQueryService.queryProduct(productQueryReqDTO, UUID.randomUUID()
                .toString());
        } catch (Exception e) {
            log.error("查询产品异常！", e);
            throw new CustomerServiceException(PortalErrorCode.REMOTE_SERVICE_INVOKE_FAIL, e);

        }
        ResultUtil.handlerResult(result);
        log.info("查询产品的响应结果：{}",result);

        return result.getResult();

    }

}
