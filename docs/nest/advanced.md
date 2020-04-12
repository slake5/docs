# 深入

## 服务

### providers 的完整写法

```typescript
providers: [
  {
    // 令牌
    provide: CatsService, // 令牌名称
    useClass: CatsService // 类提供者
  },
  {
    provide: "CONNECTION", // 令牌名称
    useValue: connection // 值提供者
  }
];
```

#### providers 的使用，用 `@Inject()` 注入(构造函数中注入)

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject("CONNECTION") connection: Connection) {}
}
```

### 非服务提供者

提供者可以提供任何值，不仅仅是服务

```typescript
const configFactory = {
  provide: "CONFIG",
  useFactory: () => {
    return process.env.NODE_ENV === "development" ? devConfig : prodConfig;
  }
};

@Module({
  providers: [configFactory]
})
export class AppModule {}
```

### 异步提供者

将 `useFactory` 设置成 `async/await` 函数

```typescript
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

### 注入

与任何其他提供程序一样，异步提供程序通过其令牌被注入到其他组件。在上面的示例中，您将使用结构 `@Inject('ASYNC_CONNECTION')`。

## 文件上传

### 单个文件

- 使用 `@UseInterceptors(FileIntercepter('file'))` 拦截器
- 使用 `@UploadedFile()` 取数据

- filename HTML 表单字段
- options: MulterOptions

### 文件数组

复数

- FilesIntercepter('files')
- `@UploadedFiles()` 复数

- filename
- maxCount 可选的数字，定义要接受的最大文件数
- options: MulterOptions

### 多个文件（全部都是不同的 key）

- FileFieldsInterceptor()

```typescript
@UseInterceptor(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 }
]))
```

- @UploadedFiles()

- uploadedFiles 对象数组，name + maxCount
- options: MulterOptions

## 数据库框架 - Typeorm

### 安装依赖

#### 注入模块

```typescript
@Module({
    imports: [TypeOrmModule.forRoot()],
})
```

#### 编写实体（存储库模式）

entity 建议跟模块文件放在一起

`photo/photo.entity.ts`

```typescript
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column("text")
  description: string;

  @Column()
  filename: string;

  @Column("int")
  views: number;

  @Column()
  isPublished: boolean;
}
```

#### forFeature() 方法定义在当前范围中注册哪些存储库

这样我们就可以使用 `@InjectRepository` 装饰器将 PhotoRepository 注入到 PhotoService

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from "./photo.entity";

@Injectable()
export class PhotoService {
  constructor(
    // 模块中必须 imports: [TypeOrmModule.forFeature([Photo])] 才可以用 @InjectRepository
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }
}
```

如果其他模块想用存储库，则需要导出其生成的提供程序

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "./photo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  exports: [TypeOrmModule]
})
export class PhotoModule {}
```

### 多数据库（也是支持的）

> 如果 .forRoot() 未指定 name，则连接的名称将设置为 default

> 不应该有多个没有名称或同名的连接否则他们会被覆盖

```typescript
const defaultOptions = {
  type: "postgres",
  port: 5432,
  username: "user",
  password: "password",
  database: "db",
  synchronize: true
};

@Module({
  imports: [
    // 链接名为 default
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: "photo_db_host",
      entities: [Photo]
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: "personsConnection",
      host: "person_db_host",
      entities: [Person]
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: "albumsConnection",
      host: "album_db_host",
      entities: [Album]
    })
  ]
})
export class AppModule {}
```

#### 使用多个数据库的连接

用 .forFeature() 第二个参数指定连接的名称

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    // 第二个参数
    TypeOrmModule.forFeature([Person], "personsConnection"),
    TypeOrmModule.forFeature([Album], "albumsConnection")
  ]
})
export class AppModule {}
```

#### 为给定的连接（服务）注入 Connection, EntityManager

- @InjectConnection('personsConnection')
- @InjectEntityManager('connectionName')

```typescript
@Injectable()
export class PersonService {
  constructor(
    @InjectConnection("personsConnection")
    private readonly connection: Connection,
    @InjectEntityManager("personsConnection")
    private readonly entityManager: EntityManager
  ) {}
}
```

> 都是在构造函数中实现注入

#### \*在工厂模式中注入依赖

```typescript
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            // 导入模块
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getString('HOST'),
                port: configService.getString('PORT')
            }),
            // 注入依赖
            inject: [ConfigService]
        })
    ]
})
```

## 问题

### 如何使用外部模块

使用 imports 导入外部模块

```typescript
// UserModule
// AuthModule

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";

@Module({
  // 导入外部模块 @Module
  imports: [UsersModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
```

#### 动态模块长这样

```typescript
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService]
    };
  }
}
```

### 切换注入范围

往 `@Injectable` 传递参数

```typescript
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

### JWT 认证

## 总结

### imports, exports, providers, controllers

- imports 只能导入模块 `xxxModule`，模块导入后，该模块可以使用导入模块的 exports
- 如果是动态 imports，返回的是

```typescript
providers: [
    {
        provide: xxx对象（类）,
        useValue?: xxx对象（类）,
        useClass?: xxxService 服务类,
        useFactory?: () => xxx对象（类）, // 可注入依赖
        useExisting: 类,
    }
]
```

- exports 包括 `xxxService`，`useValue` 的值
- 明确写在 exports 中的服务/值，可以被其他模块所使用
- providers 中的服务/值 可被该模块注入，只要是需要注入的地方都可以注入，不管是 Controller 注入，还是 provider 使用工厂函数时的注入

（未完成）

```typescript
@Module({
    providers: [
        ConfigService,
        {
            provider: 'CONFIG_ENV',
            useFactory: (configService: ConfigService) => configService.getString('ENV')
        }
    ]
})
```

#### 看这个

```typescript
MongooseModule.forRootAsync({
  useClass: MongooseConfigService
});
```

上面的构造在 MongooseModule 中实例化了 MongooseConfigService

### useExisting

useExisting：使用现有的值，可用来创建别名

```typescript
const loggerAliasProvider = {
  provide: "AliasedLoggerService",
  useExisting: LoggerService
};
```
