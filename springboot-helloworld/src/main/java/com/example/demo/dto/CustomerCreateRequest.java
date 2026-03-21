package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "创建客户请求")
public class CustomerCreateRequest {

    @NotBlank(message = "客户名称不能为空")
    @Size(max = 50, message = "客户名称长度不能超过50")
    private String name;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100")
    private String email;

    @NotBlank(message = "客户等级不能为空")
    @Pattern(regexp = "NORMAL|VIP|SVIP", message = "客户等级仅支持 NORMAL/VIP/SVIP")
    private String level;

    @NotBlank(message = "客户状态不能为空")
    @Pattern(regexp = "ACTIVE|INACTIVE", message = "客户状态仅支持 ACTIVE/INACTIVE")
    private String status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
