package com.example.demo.service;

import com.example.demo.dto.CustomerCreateRequest;
import com.example.demo.entity.Customer;
import com.example.demo.exception.BizException;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.vo.CustomerVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public CustomerVO create(CustomerCreateRequest request) {
        customerRepository.findByEmail(request.getEmail()).ifPresent(customer -> {
            throw new BizException(409, "邮箱已存在: " + request.getEmail());
        });

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setLevel(request.getLevel());
        customer.setStatus(request.getStatus());
        return toVO(customerRepository.save(customer));
    }

    @Override
    public List<CustomerVO> list() {
        return customerRepository.findAll().stream().map(this::toVO).toList();
    }

    @Override
    public CustomerVO getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "客户不存在, id=" + id));
        return toVO(customer);
    }

    private CustomerVO toVO(Customer customer) {
        CustomerVO vo = new CustomerVO();
        vo.setId(customer.getId());
        vo.setName(customer.getName());
        vo.setEmail(customer.getEmail());
        vo.setLevel(customer.getLevel());
        vo.setStatus(customer.getStatus());
        vo.setCreatedAt(customer.getCreatedAt());
        vo.setUpdatedAt(customer.getUpdatedAt());
        return vo;
    }
}
