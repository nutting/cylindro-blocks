# Spring Boot HelloWorld Demo

一个最小可跑、带接口文档和健康检查的 Spring Boot 演示项目。

## 功能

- HelloWorld 接口
- 健康检查接口
- Swagger / OpenAPI 文档
- Dockerfile
- 统一返回体

## 本地运行

```bash
cd springboot-helloworld
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

## 接口

- `GET http://localhost:8081/api/`
- `GET http://localhost:8081/api/hello`
- `GET http://localhost:8081/api/health`

## Swagger

- `http://localhost:8081/swagger-ui.html`
- `http://localhost:8081/v3/api-docs`

## 打包

```bash
cd springboot-helloworld
mvn clean package
java -jar target/springboot-helloworld-0.0.1-SNAPSHOT.jar --server.port=8081
```

## Docker

```bash
docker build -t springboot-helloworld .
docker run -p 8081:8080 springboot-helloworld
```
