# 入门

## 控制器

### 改变返回码

使用 `@HttpCode(...)` 装饰器

### 自定义响应头

```typescript
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

### 重定向

返回的值将覆盖传递给 @Redirect()装饰器的所有参数。 例如：

```typescript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

### 请求负载

我们需要确定 DTO(数据传输对象)模式。DTO是一个对象，它定义了如何通过网络发送数据。

### 目录结构

```
src
├── cats
│    ├──dto
│    │   └──create-cat.dto.ts
│    ├── interfaces
│    │       └──cat.interface.ts
│    ├──cats.service.ts
│    └──cats.controller.ts
├──app.module.ts
└──main.ts
```

## 服务

用 `@Injectable()` 装饰，会自动注入服务实例

## 模块

### 共享模块

每个模块都是一个共享模块。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 CatsService 实例。 我们需要把 CatsService 放到 exports 数组中

```typescript
import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

现在，每个导入 CatsModule 的模块都可以访问 CatsService ，并且它们将**共享相同的 CatsService 实例**

### 模块导出

模块可以导出他们的内部提供者。 而且，他们可以再导出自己导入的模块。

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

### 依赖注入

`@Module` 中提供 `providers`，就可以在模块构造函数中注入该服务实例。

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  // 依赖注入
  constructor(private readonly catsService: CatsService) {}
}
```


### 全局模块 `@Global()`

有时候，你可能只想提供一组随时可用的东西 - 例如：helper，数据库连接等等。这就是为什么你能够使模块成为全局模块。

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

全局模块应该只注册一次，最好由根或核心模块注册。 **之后，CatsService 组件将无处不在，但 CatsModule 不会被导入。**

### 动态模块

动态模块需要导出一个模块对象

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    // 需要导出这个
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

导入

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class ApplicationModule {}
```

## 中间件

- 您可以在**函数**中或在**具有 @Injectable() 装饰器的类**中实现自定义 Nest中间件。
- 这个类应该实现 NestMiddleware 接口, 而函数没有任何特殊的要求

### 中间件

#### 类中间件

Logger

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    console.log('Request......')
    next()
  }
}
```

#### 函数中间件

```typescript
export function logger(req, res, next) {
  console.log('Request.....')
  next()
}
```

> 当您的中间件没有任何依赖关系时，我们可以考虑使用函数式中间件。

### 应用中间件

通过

- 路径
- 路由通配符
- 一个控制器类
- 多个控制器类

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './modules/cats/cats.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 路径 / 通配符
    consumer.apply(LoggerMiddleware).forRoutes('cats')
    
    // 我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给 forRoutes()方法，从而进一步将中间件限制为特定的请求方法。
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET })
    
    // 控制器类
    consumer.apply(LoggerMiddleware).forRoutes(CatsController)
  }
}
```

> 可以使用 async/await来实现 configure()方法的异步化

#### 将某些路由排除在中间件应用之外

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST }
  )
  .forRoutes(CatsController);
```

> 该 exclude()方法不适用于函数中间件

### 多个中间件

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### 全局中间件

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## 异常过滤器

方法 / 类可以传入类，全局的必须传入类的实例

### 自定义异常

拓展 HttpException

```typescript
import { HttpException, HttpStatus } from '@nestjs/common'

export class ForbiddenException extends HttpException {
   constructor() {
     super('forbidden', HttpStatus.FORBIDDEN)
   }
}
```

### 自定义异常过滤器（http 异常过滤器）

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const request = ctx.getResponse<Request>()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: Date.now(),
      path: request.url,
    })
  }
}
```

#### 捕获任意类型的异常

为了捕获每一个未处理的异常(不管异常类型如何)，将 @Catch() 装饰器的参数列表设为空，例如 @Catch()

### 绑定过滤器

### 异常过滤器的作用域

- 方法范围
- 控制器范围
- 全局范围

#### 绑定单个过滤器（方法范围）

```typescript
@Post()
@UseFilters(new HttpExceptionFilter()) // 通过这个来绑定
create(@Body() createCatDto: CreateCatDto) {
    throw new ForbiddenException()
}
```

第二种使用方式，使用类而不是实例

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> 尽可能使用类而不是实例。由于 Nest 可以轻松地在整个模块中重复使用同一类的实例，因此可以减少内存使用。

#### 控制器范围

```typescript
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

#### 全局过滤器

局过滤器用于

- 整个应用程序
- 每个控制器
- 每个路由处理程序

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局 filter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

> 该 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。


就依赖注入而言，从任何模块外部注册的全局过滤器（使用上面示例中的 useGlobalFilters()）不能注入依赖，因为它们不属于任何模块。为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## 管道

- 管道是具有 @Injectable() 装饰器的类。应实现 PipeTransform 接口。
- 与异常过滤器相同，它们可以是方法范围的、控制器范围的和全局范围的。

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

### 全局通用管道

```typescript
app.useGlobalPipes(new ValidationPipe());
```

### 使用

- 参数管道(一般验证单个重要参数)

```typescript
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return await this.catsService.findOne(id);
}


@Post()
async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- 方法管道(可依赖注入)

```typescript
@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- 全局管道

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

## 守卫

守卫是一个使用 @Injectable() 装饰器的类。 守卫应该实现 CanActivate 接口。

- 守卫有一个单独的责任，它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理
- 守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。
- 与管道和异常过滤器一样，守卫可以是控制范围的、方法范围的或全局范围的。

### 反应器

Reflector，能拿到 `@SetMetadata('roles', ['admin'])` 的值

```typescript
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}


// RolesGuard

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles) // ['admin']
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => user.roles.some((role) => roles.includes(role));
    return user && user.roles && hasRole();
  }
}
```



## 拦截器

拦截器是使用 @Injectable() 装饰器注解的类。拦截器应该实现 NestInterceptor 接口。

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)

1. 缓存

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}

```

2. 函数执行前后绑定额外的逻辑

- 记录操作前后的日志

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

3. 异常映射

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException())),
      );
  }
}
```

4. 转换 stream

```typescript
在最后 map
```

## 自定义装饰器

### 例子
1. User 装饰器

```typescript
import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  return data ? req.user && req.user[data] : req.user
});
```

2. 管道

验证管道(管道传入什么输出什么)

```typescript
@Get()
async findOne(@User(new ValidationPipe()) user: UserEntity) {
  console.log(user);
}
```

## 执行顺序

```
客户端请求 ---> 中间件 ---> 守卫 ---> 拦截器之前 ---> 管道 ---> 控制器处理并响应 ---> 拦截器之后 ---> 过滤器
```

