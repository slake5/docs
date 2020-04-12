# JWT 应用

## 身份认证

### 安装依赖

```sh
yarn add @nestjs/jwt
```

### 认证中间件（包括依赖注入）

> auth.middleware.ts

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void): any {
    console.log(this.jwtService.sign(req.header("auth")));
    next();
  }
}
```

### 在 Module 模块应用中间件（根模块或者是应用模块）

> app.module.ts

```ts
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getString("SECRET"),
        signOptions: { expiresIn: 10 },
        verifyOptions: { ignoreExpiration: true }
      })
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude("auth/login")
      .forRoutes("auth");
  }
}
```
