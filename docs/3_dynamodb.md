# 3章 DynamoDB

## 概要

- Lambdaを通してDynamoDBにデータを追加したり取得したりしてみます

## ゴール

- curlでLambdaを叩くことでDynamoDBにデータを追加取得できる

## メモ

- 実行コマンド

```bash
yarn add aws-sdk
yarn deploy
```

- handler.js

```js
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

app.use(cors);

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.get('/todo', async (req, res, next) => {
  const params = {
    TableName: 'serverless-sample-dev-todo',
  };
  try {
    const result = await dynamo
      .scan(params, error => {
        if (error) throw new Error(error.stack);
      })
      .promise();
    res.send(result.Items);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

app.post('/todo', async (req, res, next) => {
  const params = {
    TableName: 'serverless-sample-dev-todo',
    Item: {
      id: String(Date.now()),
      text: 'TODOです',
    },
  };
  try {
    await dynamo
      .put(params, error => {
        if (error) throw new Error(error.stack);
      })
      .promise();
    res.send(params);
  } catch (e) {
    console.log(e);
    next(e);
  }
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
# ↓↓↓追加した部分↓↓↓
  environment:
    DYNAMODB_TABLE: ${self:service}-${self:provider.stage}
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

