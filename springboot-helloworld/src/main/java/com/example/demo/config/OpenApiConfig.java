package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI demoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot Enterprise Demo API")
                        .version("1.1.0")
                        .description("一个可直接演示的 Spring Boot 企业风格示例项目")
                        .contact(new Contact().name("OpenClaw Assistant")));
    }
}
