/**
 * tisson.com.cn Inc.
 * Copyright (c) 2016-2017 All Rights Reserved.
 */
package com.identification.portal.web.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.identification.customer.service.api.request.ProductQueryReqDTO;
import com.identification.customer.service.api.response.ProductQueryResDTO;
import com.identification.portal.service.PortalProductQueryService;

/**
 * @author luohui
 * @version Id: ProductController.java, v 0.1 2017/3/23 9:56 luohui Exp $$
 */
@Controller
@RequestMapping("/product")
@Slf4j
public class ProductController {

    @Autowired
    private PortalProductQueryService portalProductQueryService;

    @RequestMapping(value = "/productInfoList")
    public String queryProduct(HttpServletRequest request, Model model) {

        try {

            ProductQueryReqDTO productQueryReqDTO = new ProductQueryReqDTO();
            List<ProductQueryResDTO> productQueryResDTOs = portalProductQueryService
                .queryProductList(productQueryReqDTO);
            model.addAttribute("errorCode", "0000");
            model.addAttribute("errorMsg", "查询成功");
            model.addAttribute("productList", productQueryResDTOs);
        } catch (Exception e) {

            model.addAttribute("errorCode", "0001");
            model.addAttribute("errorMsg", "查询异常");

        }

        return "product/productInfoList";
    }
}
