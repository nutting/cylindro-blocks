package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Hello Demo", description = "Spring Boot 演示接口")
@RestController
@RequestMapping("/api")
public class HelloController {

    @Operation(summary = "根欢迎接口")
    @GetMapping("/")
    public ApiResponse<Map<String, String>> root() {
        return ApiResponse.success(Map.of("message", "Hello, Spring Boot!"));
    }

    @Operation(summary = "HelloWorld 接口")
    @GetMapping("/hello")
    public ApiResponse<Map<String, String>> hello() {
        return ApiResponse.success(Map.of("message", "Hello World"));
    }
}
