package com.example.demo.service;

import com.example.demo.dto.CustomerCreateRequest;
import com.example.demo.vo.CustomerVO;

import java.util.List;

public interface CustomerService {
    CustomerVO create(CustomerCreateRequest request);
    List<CustomerVO> list();
    CustomerVO getById(Long id);
}
