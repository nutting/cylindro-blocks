package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.dto.CustomerCreateRequest;
import com.example.demo.service.CustomerService;
import com.example.demo.vo.CustomerVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Customer", description = "客户管理接口")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @Operation(summary = "创建客户")
    @PostMapping
    public ApiResponse<CustomerVO> create(@Valid @RequestBody CustomerCreateRequest request) {
        return ApiResponse.success(customerService.create(request));
    }

    @Operation(summary = "客户列表")
    @GetMapping
    public ApiResponse<List<CustomerVO>> list() {
        return ApiResponse.success(customerService.list());
    }

    @Operation(summary = "客户详情")
    @GetMapping("/{id}")
    public ApiResponse<CustomerVO> getById(@PathVariable Long id) {
        return ApiResponse.success(customerService.getById(id));
    }
}
