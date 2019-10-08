# 2章 Lambda

## 概要

- AWS Lambdaに関数をデプロイしてみます

## ゴール

- Lambdaにデプロイにブラウザからアクセスしレスポンスを取得できる

## メモ

- 実行コマンド

```bash
mkdir serverless-sample
cd serverless-sample
yarn init -y
sls create -t aws-nodejs
yarn add express serverless-http
serverless config credentials --provider aws --key xxxxxxxxxxxxxx --secret xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
yarn deploy
```

- handler.js

```js
const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello');
});

module.exports.hello = serverless(app);
```

- serverless.yml

```yml
service: serverless-sample
provider:
  name: aws
  runtime: nodejs10.x
  region: ap-northeast-1
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: /{ANY+}
          method: ANY
          cors: true
```

