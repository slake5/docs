# 入门

文档链接 `https://github.com/typeorm/typeorm/blob/master/README-zh_CN.md`

## 关系

### @JoinColumn 装饰器

- @JoinColumn 装饰器表明实体键的对应关系
- 关系可以是单向的，也可以是单向的
- 在关系的所有方使用 @JoinColumn，以及可以使用 { cascade: true } 实现自动保存

#### 保存一对一的关系

```ts
// 创建 photo
let photo = new Photo();
photo.name = "Me and Bears";
photo.description = "I am near polar bears";

// 创建 photo metadata
let metadata = new PhotoMetadata();
metadata.height = 640;
metadata.width = 480;
metadata.photo = photo; // 联接两者

// 获取实体 repositories
let photoRepository = connection.getRepository(Photo);
let metadataRepository = connection.getRepository(PhotoMetadata);

// 先保存photo
await photoRepository.save(photo);

// 然后保存photo的metadata
await metadataRepository.save(metadata);
```

#### 反向关系

```ts
@Entity()
export class PhotoMetadata {
  /* ... 其他列 */

  @OneToOne(
    type => Photo,
    photo => photo.metadata
  )
  @JoinColumn()
  photo: Photo;
}
```

```ts
@Entity()
export class Photo {
  /* ... 其他列 */

  @OneToOne(
    type => PhotoMetadata,
    photoMetadata => photoMetadata.photo
  )
  metadata: PhotoMetadata;
}
```

#### 用 cascades 自动保存相关对象

```ts
export class Photo {
  /// ... 其他列

  @OneToOne(
    type => PhotoMetadata,
    metadata => metadata.photo,
    {
      cascade: true
    }
  )
  metadata: PhotoMetadata;
}
```

```ts
// 创建 photo 对象
let photo = new Photo();
photo.name = "Me and Bears";
photo.description = "I am near polar bears";
photo.filename = "photo-with-bears.jpg";
photo.isPublished = true;

// 创建 photo metadata 对象
let metadata = new PhotoMetadata();
metadata.height = 640;
metadata.width = 480;
metadata.compressed = true;
metadata.comment = "cybershoot";
metadata.orientation = "portait";

photo.metadata = metadata; // this way we connect them

// 获取 repository
let photoRepository = connection.getRepository(Photo);

// 保存photo的同时保存metadata
await photoRepository.save(photo);
```

#### 创建多对多关系

- @JoinTable 需要指定这是关系的所有者方。

```ts
export class Photo {
  /// ... 其他列

  @ManyToMany(
    type => Album,
    album => album.photos
  )
  albums: Album[];
}
```

## 实体

### 自动增减（特殊列）

- @CreateDateColumn 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置。
- @UpdateDateColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时，自动更新实体日期。无需设置此列，该值将自动设置。
- @VersionColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时自动增长实体版本（增量编号）。无需设置此列，该值将自动设置。

### enum 列类型

```ts
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GHOST
  })
  role: UserRole;
}
```

### simple-array 的列类型

有一种称为 simple-array 的特殊列类型，它可以将原始数组值存储在单个字符串列中。 所有值都以逗号分隔。 例如：

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-array")
  names: string[];
}

//
const user = new User();
user.names = ["Alexander", "Alex", "Sasha", "Shurik"];
```

### simple-json 列类型

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json")
  profile: { name: string; nickname: string };
}

//
const user = new User();
user.profile = { name: "John", nickname: "Malkovich" };
```

### 具有生成值的列（如：uuid）

```ts
@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;
}
```

### 实体继承（abstract）

你可以使用实体继承减少代码中的重复。

```ts
export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}

@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}

@Entity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

## 关系

### 一对一

1. 一对一需要 @JoinColumn
2. 我们应该仅在关系的一侧使用 @JoinColumn 装饰器。
3. 你把这个装饰者放在哪一方将是这段关系的拥有方。
4. 关系的拥有方包含数据库中具有外键的列。

#### 我们以 User 和 Profile 实体为例。

1. 用户只能拥有一个配置文件，并且一个配置文件仅由一个用户拥有。

```ts
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(type => Profile)
  @JoinColumn()
  profile: Profile;
}
```

2. 一对一的双向关系

```ts
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;

  // 都指向另一个字段
  @OneToOne(
    type => User,
    user => user.profile
  ) // 将另一面指定为第二个参数
  user: User;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 都指向另一个字段
  @OneToOne(
    type => Profile,
    profile => profile.user
  ) // 指定另一面作为第二个参数
  @JoinColumn()
  profile: Profile;
}
```

> 我们只是创建了双向关系。 注意，反向关系没有@JoinColumn。

#### 如何保存？

1. 先保存被对应的（小的）
2. 在保存主动对应的（大的）

```ts
// 创建 photo
let photo = new Photo();

// 创建 photo metadata
let metadata = new PhotoMetadata();
metadata.photo = photo; // 联接两者

// 先保存photo
await photoRepository.save(photo);

// 然后保存photo的metadata
await metadataRepository.save(metadata);
```

#### 如何取出？

`relations: ["metadata"]`

##### find

```ts
let photoRepository = connection.getRepository(Photo);
let photos = await photoRepository.find({ relations: ["metadata"] });
```

##### QueryBuilder

```ts
createConnection(/*...*/)
  .then(async connection => {
    /*...*/
    let photos = await connection
      .getRepository(Photo)
      .createQueryBuilder("photo")
      .innerJoinAndSelect("photo.metadata", "metadata")
      .getMany();
  })
  .catch(error => console.log(error));
```

#### 为什么要建立反向关系

- PhotoMetadata 和 Photo 之间的关系是单向的。
- 关系的所有者是 PhotoMetadata，而 Photo 对 PhotoMetadata 一无所知。
- 这使得从 Photo 中访问 PhotoMetadata 变得很复杂。

#### cascade 自动保存

在关系所有者中加入 cascade 则会自动保存其所有关系

### 多对一、一对多的关系

User 可以拥有多张 photos，但每张 photo 仅由一位 user 拥有。

可以在这种关系中省略 @JoinColumn

```ts
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(
    type => User,
    user => user.photos
  )
  user: User;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    type => Photo,
    photo => photo.user
  )
  photos: Photo[];
}
```

#### 如何保存这种关系

一

```ts
const photo1 = new Photo();
photo1.url = "me.jpg";
await connection.manager.save(photo1);

const photo2 = new Photo();
photo2.url = "me-and-bears.jpg";
await connection.manager.save(photo2);

const user = new User();
user.name = "John";
user.photos = [photo1, photo2];
await connection.manager.save(user);
```

二

```ts
const user = new User();
user.name = "Leo";
await connection.manager.save(user);

const photo1 = new Photo();
photo1.url = "me.jpg";
photo1.user = user;
await connection.manager.save(photo1);

const photo2 = new Photo();
photo2.url = "me-and-bears.jpg";
photo2.user = user;
await connection.manager.save(photo2);
```

#### 如何取出？

##### find

```ts
const userRepository = connection.getRepository(User);
const users = await userRepository.find({ relations: ["photos"] });

// or from inverse side

const photoRepository = connection.getRepository(Photo);
const photos = await photoRepository.find({ relations: ["user"] });
```

##### QueryBuilder

```ts
const users = await connection
  .getRepository(User)
  .createQueryBuilder("user")
  .leftJoinAndSelect("user.photos", "photo")
  .getMany();

// or from inverse side

const photos = await connection
  .getRepository(Photo)
  .createQueryBuilder("photo")
  .leftJoinAndSelect("photo.user", "user")
  .getMany();
```

### 多对多的关系

@JoinTable 是 @ManyToMany 必须的

Question 可以有多个 categories, 每个 category 可以有多个 questions。

```ts
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    type => Question,
    question => question.categories
  )
  questions: Question[];
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany(
    type => Category,
    category => category.questions
  )
  @JoinTable()
  categories: Category[];
}
```

如何保存这种关系

```ts
const category1 = new Category();
category1.name = "animals";
await connection.manager.save(category1);

const category2 = new Category();
category2.name = "zoo";
await connection.manager.save(category2);

const question = new Question();
question.categories = [category1, category2];
await connection.manager.save(question);
```

### Eager 和 Lazy 关系

#### Eager 关系

- 每次从数据库加载实体时，都会自动加载 Eager 关系。
- 现在当你加载 questions 时，不需要加入或指定要加载的关系。它们将自动加载：
- save 也是？

#### Lazy 关系

- 当你访问的时候会加载 Lazy 关系中的实体。
- 这种关系必须有 Promise 作为类型 ，并且将值存储在一个 promise 中， 当你加载它们时，也会返回 promise。

```ts
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    type => Question,
    question => question.categories
  )
  questions: Promise<Question[]>;
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany(
    type => Category,
    category => category.questions
  )
  @JoinTable()
  categories: Promise<Category[]>;
}
```

保存

```ts
const category1 = new Category();
category1.name = "animals";
await connection.manager.save(category1);

const category2 = new Category();
category2.name = "zoo";
await connection.manager.save(category2);

const question = new Question();
// 注意 Promise.resolve([])
question.categories = Promise.resolve([category1, category2]);
await connection.manager.save(question);
```

加载

```ts
const question = await connection.getRepository(Question).findOne(1);
const categories = await question.categories;
```

## Entity Manager 和 Repository

### 条件

```ts
userRepository.find({ where: { name: { first: "Timber", last: "Saw" } } });
```

#### OR 运算

```ts
userRepository.find({
  where: [
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Stan", lastName: "Lee" }
  ]
});
```

#### order 选择排序

```ts
userRepository.find({
  order: {
    name: "ASC",
    id: "DESC"
  }
});
```

#### skip - 偏移（分页）

```ts
userRepository.find({
  skip: 5
});
```

#### take - limit (分页) - 得到的最大实体数。

userRepository.find({
take: 10
});

#### cache - 启用或禁用查询结果缓存。 有关更多信息和选项，

```ts
userRepository.find({
  cache: true
});
```

#### lock - 启用锁查询。 只能在 findOne 方法中使用。

lock 是一个对象，可以定义为：

```ts
{ mode: "optimistic", version: number|Date }

// 或者

{ mode: "pessimistic_read"|"pessimistic_write"|"dirty_read" }
```

```ts
userRepository.findOne(1, {
  lock: { mode: "optimistic", version: 1 }
});
```

#### find 选项的完整示例：

```ts
userRepository.find({
  select: ["firstName", "lastName"],
  relations: ["profile", "photos", "videos"],
  where: {
    firstName: "Timber",
    lastName: "Saw"
  },
  order: {
    name: "ASC",
    id: "DESC"
  },
  skip: 5,
  take: 10,
  cache: true
});
```

### 进阶选项

#### Not

```ts
const loadedPosts = await connection.getRepository(Post).find({
  where: {
    title: Not("About #1")
  }
});
```

#### LessThan / LessThanOrEqual / MoreThan / MoreThanOrEqual / Equal

```ts
const loadedPosts = await connection.getRepository(Post).find({
  where: {
    likes: LessThan(10)
  }
});
```

#### Like

```ts
const loadedPosts = await connection.getRepository(Post).find({
  where: {
    title: Like("%out #%")
  }
});
```

#### Between

```ts
const loadedPosts = await connection.getRepository(Post).find({
  where: {
    likes: Between(1, 10)
  }
});
```

#### In

#### Any

#### IsNull

```ts
const loadedPosts = await connection.getRepository(Post).find({
  where: {
    likes: Between(1, 10)
  }
});
```

#### Raw

注意：注意 Raw 操作符。 它应该从提供的表达式执行纯 SQL，而不能包含用户输入，否则将导致 SQL 注入。

## QueryBuilder

QueryBuilder 的简单示例:

```ts
const firstUser = await connection
  .getRepository(User)
  .createQueryBuilder("user")
  .select("user.username")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

### orderBy、groupBy

- orderBy 排序
- groupBy 聚合

### 插入

```ts
await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values([
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Phantom", lastName: "Lancer" }
  ])
  .execute();
```

#### 原始 SQL 支持

```ts
await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values({
    firstName: "Timber",
    lastName: () => "CONCAT('S', 'A', 'W')"
  })
  .execute();
```
