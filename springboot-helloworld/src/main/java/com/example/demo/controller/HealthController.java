package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@Tag(name = "Health", description = "健康检查接口")
@RestController
@RequestMapping("/api")
public class HealthController {

    @Operation(summary = "健康检查")
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.success(Map.of(
                "status", "UP",
                "service", "springboot-helloworld",
                "time", LocalDateTime.now().toString()
        ));
    }
}
