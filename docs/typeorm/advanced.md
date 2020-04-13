# 进阶

## 迁移（未完成）

### 例子

```ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name"`);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`); // 恢复"up"方法所做的事情
  }
}
```

### 使用

```ts
TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // 引入迁移
        migrations: [__dirname + '/**/*.migration{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
```

## 事务

### 例子

```ts
// 开始事务：
await queryRunner.startTransaction();

try {
  // 对此事务执行一些操作：
  await queryRunner.manager.save(user1);
  await queryRunner.manager.save(user2);
  await queryRunner.manager.save(photos);

  // 提交事务：
  await queryRunner.commitTransaction();
} catch (err) {
  // 有错误做出回滚更改
  await queryRunner.rollbackTransaction();
}
```

## 索引

### 增加索引和索引名称

```ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  // @Index("name1-idx") // 或指定索引名称
  @Column()
  firstName: string;

  @Column()
  @Index()
  // @Index("name2-idx") // 或指定索引名称
  lastName: string;
}
```

### 唯一索引

```ts
@Index({ unique: true })
```

### 联合索引

要创建具有多个列的索引，需要将@Index 放在实体本身上，并指定应包含在索引中的所有列属性名称。

```ts
@Entity()
@Index(["firstName", "lastName"])
@Index(["firstName", "middleName", "lastName"], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;
}
```

## 监听器（写在 Entity 内） / 订阅者（单独实现订阅接口）

### 监听器

#### @AfterLoad

你可以在实体中定义具有任何名称的方法，并使用@AfterLoad 标记它，TypeORM 将在每次实体时调用它

```ts
@Entity()
export class Post {
  @AfterLoad()
  updateCounters() {
    if (this.likesCount === undefined) this.likesCount = 0;
  }
}
```

#### @BeforeInsert

TypeORM 将在使用 repository/manager save 插入实体之前调用它。

#### @AfterInsert

save 插入实体后调用

#### @BeforeUpdate

#### @AfterUpdate

#### @BeforeRemove

#### @AfterRemove

#### @AfterUpdate

### 订阅者（可从监听者中分离开来）

订阅实体时间或任何实体事件

```ts
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  /**
   * 表示此订阅者仅侦听Post事件。
   */
  listenTo() {
    return Post;
  }

  /**
   * 插入post之前调用。
   */
  beforeInsert(event: InsertEvent<Post>) {
    console.log(`BEFORE POST INSERTED: `, event.entity);
  }
}
```

#### 监听任何实事件

- 你只需省略 listenTo 方法
- 使用 any

```ts
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {
  /**
   * 在实体插入之前调用。
   */
  beforeInsert(event: InsertEvent<any>) {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
  }
}
```

#### 启用监听

```ts
TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // ...
        subscribers: [__dirname + '/**/*.subscription{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
```

## 日志

### 记录耗时长的查询

```ts
{
    host: "localhost",
    ...
    maxQueryExecutionTime: 1000
}
```

### 更改默认记录器

- advanced-console - 默认记录器，它将使用颜色和 sql 语法高亮显示所有记录到控制台中的消息（使用 chalk）。
- simple-console - 简单的控制台记录器，与高级记录器完全相同，但它不使用任何颜色突出显示。 如果你不喜欢/或者使用彩色日志有问题，可以使用此记录器。
- file - 这个记录器将所有日志写入项目根文件夹中的 ormlogs.log（靠近 package.json 和 ormconfig.json）。
- debug - 此记录器使用 debug package 打开日志记录设置你的 env 变量 DEBUG = typeorm：\*（注意记录选项对此记录器没有影响）。

```ts
{
    host: "localhost",
    ...
    logging: true,
    logger: "file"
}
```

### 使用自定义记录器

```ts
import { Logger } from "typeorm";

export class MyCustomLogger implements Logger {
  // 实现logger类的所有方法
}

createConnection({
  // ...
  logger: new MyCustomLogger()
});
```

## Active Record 与 Data Mapper

### Active Record

- 使用 Active Record 方法，你可以在模型本身内定义所有查询方法，并使用模型方法保存、删除和加载对象。
- 该方法在 Service 中不用再注入依赖
- Module 中页不用再导入 .forFeature([])

### Data Mapper

使用 Data Mapper 方法，你可以在名为"repositories"的单独类中定义所有查询方法，并使用存储库保存、删除和加载对象。 在数据映射器中，你的实体非常笨，它们只是定义了相应的属性，并且可能有一些很笨的方法。

## 验证

### class-validator （在 Entity 中使用）

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(10, 20)
  title: string;

  @Column()
  @Contains("hello")
  text: string;

  @Column()
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsFQDN()
  site: string;

  @Column()
  @IsDate()
  createDate: Date;
}
```

验证

```ts
import { getManager } from "typeorm";
import { validate } from "class-validator";

let post = new Post();
post.title = "Hello"; // 不应该通过
post.text = "this is a great post about hell world"; //不应该通过
post.rating = 11; //不应该通过
post.email = "google.com"; //不应该通过
post.site = "googlecom"; //不应该通过

const errors = await validate(post);
if (errors.length > 0) {
  throw new Error(`Validation failed!`);
} else {
  await getManager().save(post);
}
```

## 最佳实践

### 不要在 Entity 中初始化外链属性

- 初始化普通属性很有用
- 但初始化 categores: Category[] = [] 会把 categories 关系删除

可以把它标记为 nullable: true
