# Spring Boot Enterprise Demo

一个适合展示给面试、汇报、售前演示的最小企业风格 Spring Boot 项目。

## 现在有什么

- 统一响应体 `ApiResponse`
- Swagger / OpenAPI 文档
- 健康检查接口
- `customer` 客户管理示例模块
- `controller / service / repository / dto / vo / entity` 分层
- 参数校验（Validation）
- 全局异常处理
- JPA + H2 内存数据库
- 初始化演示数据
- Dockerfile + docker-compose
- `dev` 环境配置示例

## 项目结构

```text
src/main/java/com/example/demo
├── common        # 通用响应体
├── config        # 配置类
├── controller    # 接口层
├── dto           # 请求对象
├── entity        # 数据实体
├── exception     # 异常处理
├── repository    # 数据访问层
├── service       # 业务层
└── vo            # 返回对象
```

## 本地运行

```bash
cd springboot-helloworld
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

如果想带开发环境配置运行：

```bash
cd springboot-helloworld
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081 --spring.profiles.active=dev"
```

## 主要接口

### 基础接口

- `GET /api/`
- `GET /api/hello`
- `GET /api/health`

### 客户管理接口

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`

请求示例：

```json
{
  "name": "Wayne Enterprises",
  "email": "contact@wayne.com",
  "level": "VIP",
  "status": "ACTIVE"
}
```

## Swagger

- <http://localhost:8081/swagger-ui.html>
- <http://localhost:8081/v3/api-docs>

## H2 控制台

- <http://localhost:8081/h2-console>
- JDBC URL: `jdbc:h2:mem:demo`
- User: `sa`
- Password: 留空

## 打包运行

```bash
cd springboot-helloworld
mvn clean package
java -jar target/springboot-helloworld-0.0.1-SNAPSHOT.jar --server.port=8081
```

## Docker 运行

```bash
cd springboot-helloworld
docker build -t springboot-enterprise-demo .
docker run -p 8081:8080 springboot-enterprise-demo
```

## Docker Compose

```bash
cd springboot-helloworld
docker compose up --build
```

## 后续还能继续补什么

如果要再往“更像企业项目”推进，下一步建议是：

- 接入 MySQL / PostgreSQL
- 增加分页查询、条件筛选
- 引入 MapStruct / Lombok
- 增加单元测试与接口测试
- 加 Spring Security + JWT
- 加审计字段、操作日志
- 增加 CI/CD 配置
