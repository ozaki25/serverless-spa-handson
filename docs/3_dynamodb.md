# 3章 DynamoDB

## 概要

- Lambdaを通してDynamoDBにデータを追加したり取得したりしてみます

## ゴール

- curlコマンドでLambdaにアクセスして、DynamoDBにデータを追加/取得できる

## 登場する技術

- Amazon DynamoDB

### Amazon DynamoDB

- AWSのデータベースサービス
- SQLを用いないkey-value形式のデータベースです

## ハンズオン

### DynamoDBのテーブル作成

- Serverless Frameworkを使ってDynamoDBのテーブルを作成します
- `serverless.yml`を修正します

```yml
service: serverless-sample
provider:
  name: aws
  runtime: nodejs10.x
  region: ap-northeast-1
  # ↓↓↓追加した部分↓↓↓
  environment:
    DYNAMODB_TABLE: ${self:service}-${self:provider.stage}
  # DynamoDBにアクセスするための権限の設定
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}*'
# ↑↑↑追加した部分↑↑↑
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: /{ANY+}
          method: ANY
          cors: true
# ↓↓↓追加した部分↓↓↓
# DynamoDBのテーブル定義の設定
resources:
  Resources:
    Todo:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.DYNAMODB_TABLE}-todo
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
# ↑↑↑追加した部分↑↑↑
```

- デプロイするとテーブルが作成されます

```bash
serverless deploy
```

### マネジメントコンソールでテーブルを確認する

- AWSのマネジメントコンソールにログインしDynamoDBのテーブルを選択して作成されていることを確認してください

![DynamoDB](/images/3-1.png)

### DynamoDBにデータを追加する

- LambdaからDynamoDBにアクセスしデータを追加する処理を追加します
- 必要なライブラリを追加します

```bash
yarn add aws-sdk
```

- `handler.js`を修正してください

```js
const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ↓↓↓追加した行↓↓↓
// ライブラリのセットアップ
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

// POSTで/todoにアクセスした時に実行される処理
app.post('/todo', async (req, res, next) => {
  // bodyの値を取得
  const { text } = req.body;

  const params = {
    // アクセスするテーブル名(サービス名-dev-todo)
    TableName: 'serverless-sample-dev-todo',
    // 追加するデータ
    Item: { id: String(Date.now()), text },
  };

  try {
    await dynamo.put(params, error => {
      if (error) throw new Error(error.stack);
    }).promise();
    res.send(params);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
// ↑↑↑追加した行↑↑↑

module.exports.hello = serverless(app);
```

- POSTで`/todo`にアクセスするとアクセス時に渡された値をテーブルに追加する実装です
    - データの追加に`put`メソッドを使っています
- デプロイコマンドでアップロードします

```bash
serverless deploy
```

### curlで動作確認

- curlコマンドで作成したエンドポイントにアクセスしDynamoDBにデータが作成されることを確認します
    - urlの部分はデプロイコマンド実行後に表示されるurlの後ろに`/todo`を追加したものを設定してください

```bash
curl -X POST -H "Content-Type: application/json" -d '{"text":"TODO"}' https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/todo
```

- マネジメントコンソールで登録されていることを確認します

![DynamoDBへ登録](/images/3-2.png)

### DynamoDBからデータを取得する

- LambdaからDynamoDBにアクセスしデータを取得する処理を追加します
- `handler.js`を修正してください

```js
// 省略

// GETで/todoにアクセスした時に実行される処理
app.get('/todo', async (req, res, next) => {
  const params = {
    // アクセスするテーブル名(サービス名-dev-todo)
    TableName: 'serverless-sample-dev-todo',
  };
  try {
    const result = await dynamo.scan(params, error => {
        if (error) throw new Error(error.stack);
      }).promise();
    res.send(result.Items);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports.hello = serverless(app);
```

- GETで`/todo`にアクセスするとテーブルのデータを全量取得する実装です
    - データの全量取得には`scan`メソッドを使っています
- デプロイコマンドでアップロードします

```bash
serverless deploy
```

### curlで動作確認

- curlコマンドで作成したエンドポイントにアクセスしDynamoDBからデータを取得できることを確認します
    - urlの部分はデプロイコマンド実行後に表示されるurlの後ろに`/todo`を追加したものを設定してください

```bash
curl -X GET https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/todo
```

- curlコマンド実行時のログでデータが取得できていることを確認できます

![DynamoDBからのデータ取得](/images/3-3.png)

## まとめ

- この章では以下のことを学びました
    - ServerlessFrameworkを使ってDynamoDBのテーブルを作成する
    - LambdaからDynamoDBにアクセスしデータを追加する
    - LambdaからDynamoDBにアクセスしデータを取得する

