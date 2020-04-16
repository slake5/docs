# 应用

## 装饰器

### @JoinColumn 装饰器

- @JoinColumn 装饰器表明实体键的对应关系
- 关系可以是单向的，也可以是单向的
- 在关系的所有方使用 @JoinColumn，以及可以使用 { cascade: true } 实现自动保存
- @JoinColumn 的使用方会生成一个外键，在外键删除之前，被外键引用的数据不能被删除！
- @ManyToOne 可省略 @JoinColumn

```ts
// UserEntity
@Entity()
export class UserEntity extends BasicEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '用户id' })
  userId: string

  @Column({ comment: '用户名' })
  username: string

  @Column({ comment: '头像', nullable: true })
  avatar: string

  @Column({ comment: '用户角色', nullable: true })
  role: UserRole

  @OneToOne(
    type => UserAccountEntity,
    entity => entity.userEntity,
  )
  userAccountEntity: UserAccountEntity
}

// UserAccountEntity
@Entity()
export class UserAccountEntity extends BasicEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '账户id' })
  accountId: string

  @Column({ comment: '账号' })
  account: string

  @Column({ comment: '密码' })
  password: string

  @OneToOne(
    type => UserEntity,
    userEntity => userEntity.userAccountEntity,
    { cascade: true }
  )
  @JoinColumn()
  userEntity: UserEntity
}

```

## QueryBuilder

### 使用 QueryBuilder 避免转义

```ts
// 会转义
await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values([{ firstName: 'Timber' }, { firstName: 'Phantom' ])
  .execute()

// 不会转义
await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values({
    firstName: 'Timber',
    lastName: () => "CONCAT('S', 'A', 'W')",
  })
  .execute()

```

### 使用 QueryBuilder 来保存 relations 数据

```ts
await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of(post)
  .add(category)
```

## 联表查询

### 例如新增 count，并覆盖原字段

```ts
articleDetail(articleId: string) {
    return ArticleEntity
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.comments', 'b', `b.status = 'normal'`)
      .leftJoinAndSelect(qb => {
        return qb
          .select(`count(*)`, 'like_num') // 需要统计的数据
          .addSelect('like.id', 'like_id') // 选出该字段是为了与外界 key 做比较
          .from(LikeEntity, 'like')
          .groupBy(`like.id`)
      }, 'like_count', `like_count.like_id = b.commentId`)
      .addSelect('like_count.like_num', 'b_likeNum') // 覆盖 b.likeNum，b 为 a.comments 的别名
      .leftJoinAndSelect('a.tmpUser', 'c')
      .leftJoinAndSelect('b.tmpUser', 'b_t')
      .where('a.articleId = :articleId', { articleId })
      .getOne()
  }
```

相当于以下字段

```sql
SELECT `a`.`inserTime` AS `a_inserTime`, `a`.`updateTime` AS `a_updateTime`, `a`.`articleId` AS `a_articleId`, `a`.`title` AS `a_title`, `a`.`content` AS `a_content`, `a`.`views` AS `a_views`, `a`.`status` AS `a_status`, `a`.`reference` AS `a_reference`, `a`.`images` AS `a_images`, `a`.`category` AS `a_category`, `a`.`subCategory` AS `a_subCategory`, `a`.`tmpUserAppId` AS `a_tmpUserAppId`
     , `b`.`inserTime` AS `b_inserTime`, `b`.`updateTime` AS `b_updateTime`, `b`.`commentId` AS `b_commentId`, `b`.`content` AS `b_content`, `b`.`status` AS `b_status`, `b`.`reference` AS `b_reference`, `b`.`likeNum` AS `b_likeNum`, `b`.`articleArticleId` AS `b_articleArticleId`, `b`.`tmpUserAppId` AS `b_tmpUserAppId`
     , `like_count`.*
     , `c`.`inserTime` AS `c_inserTime`, `c`.`updateTime` AS `c_updateTime`, `c`.`appId` AS `c_appId`, `c`.`email` AS `c_email`, `c`.`nickname` AS `c_nickname`
     , `b_t`.`inserTime` AS `b_t_inserTime`, `b_t`.`updateTime` AS `b_t_updateTime`, `b_t`.`appId` AS `b_t_appId`, `b_t`.`email` AS `b_t_email`, `b_t`.`nickname` AS `b_t_nickname`
     , like_count.like_num AS `b_likeNum`
FROM `article_entity` `a`
    LEFT JOIN `article_comment_entity` `b` ON `b`.`status` = 'normal'
    LEFT JOIN (SELECT `like`.`id` AS `like_id`, count(*) AS `like_num` FROM `like_entity` `like` GROUP BY `like`.`id`) `like_count` ON like_count.like_id = `b`.`commentId`
    LEFT JOIN `user_tmp_entity` `c` ON `c`.`appId`=`a`.`tmpUserAppId`
    LEFT JOIN `user_tmp_entity` `b_t` ON `b_t`.`appId`=`b`.`tmpUserAppId`
WHERE `a`.`articleId` = '0c70b848-9102-477b-b997-a5eaf85e33bf';
```
