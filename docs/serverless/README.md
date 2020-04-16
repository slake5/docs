# start

## 超简单，在serverless部署nest.js

### 在 src 目录下新建 index.ts 文件

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

export const createApp = async (): Promise<express.Express> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  await app.init();
  return expressApp
}
```

### 编辑 serverless.yml 文件

```yaml
express:
  component: 'serverless-nestjs-for-tencent'
  inputs:
    region: ap-guangzhou
    codeUri: './api'

```

## 注意

不能删除 .serverless，删除后会重新部署服务，导致与原域名不一致
