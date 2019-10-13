# 2章 Lambda

## 概要

- AWS Lambdaに関数をデプロイしてみます

## ゴール

- Lambdaにデプロイしてブラウザからアクセスしレスポンスを確認する

## 登場する技術

- AWS Lambda
- Amazon API Gateway
- Express
- Serverless Framework

### AWS Lambda

- 関数をデプロイしアクセスすることができるAWSのサービス
- アクセスの都度プロセスが起動し終了すると停止する
    - サーバを起動し続けるわけではないので、サーバの運用や監視が不要
- 実行時間の単位で課金される

### Amazon API Gateway

- HTTPのアクセスポイントを作るAWSのサービス
- 今回はHTTPのリクエストを受け取ってLambdaの処理を呼ぶことでClientとLambdaのつなぎ役として使う

### Express

- Node.jsの軽量なアプリケーションフレームワーク

### Serverless Framework

- LambdaやAPI Gatewayを簡単に構築するためのコマンドラインツール
- GCPやAzureなどAWS以外のサービスにも対応している

## ハンズオン

### プロジェクトの雛形作成

- Nodeプロジェクトの雛形を作ります

```bash
mkdir serverless-sample
cd serverless-sample
yarn init -y
```

- `package.json`が作成されていればOK

### Serverless Frameworkのインストール

- serverlessをグローバルインストールする

```bash
npm i -g serverless
serverless -v
```

- `serverless -v`を実行してバージョン情報が表示されればOK

### Serverless Frameworkの雛形生成

- 今回は`aws-nodejs`というテンプレートを使う

```bash
serverless create -t aws-nodejs
```

- `handler.js`と`serverless.yml`が生成されていればOK

### serverless.ymlの修正

- 生成された`serverless.yml`を見るとコメントアウトされた行で使い方を説明してくれています
- コメントをすべて削除すると以下のようになるはずです

```yml
service: serverless-sample # Lambdaの関数名などに使われるサービス名
provider:
  name: aws # AWSを使うという設定
  runtime: nodejs10.x # NodeのVersion10系を使うという設定
functions: # Lambdaに関する設定
  hello:
    handler: handler.hello # ファイル名.エクスポート名
```

- ここにリージョンの設定とAPI Gatewayの設定を追加します

```yml
service: serverless-sample
provider:
  name: aws
  runtime: nodejs10.x
  region: ap-northeast-1 # 東京リージョンを設定
functions:
  hello:
    handler: handler.hello
    events: # API Gatewayに関する設定
      - http:
          path: /{ANY+}
          method: ANY
          cors: true
```

### ライブラリのインストール

- 関数を作るのに必要なライブラリをインストールします

```bash
yarn add express serverless-http cors
```

### 関数の作成

- Lambdaにデプロイする関数を作成します
- `handler.js`の内容を以下に書き換えてください

```js
// ライブラリのインポート
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// ライブラリのセットアップ
const app = express();
app.use(cors());

// 関数の作成
// /helloにアクセスするとHelloを返す関数
app.get('/hello', (req, res) => {
  res.send('Hello');
});

// 関数のエクスポート
module.exports.hello = serverless(app);
```

### AWSのキー情報の設定

- AWSにデプロイするためにアクセスキーの情報を設定します
- アクセスキーの発行については[IAM ユーザーのアクセスキーの管理](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)を参考に実施してください
- 以下のコマンドの`aws_access_key_id`にAccess key IDを、`aws_secret_access_key`にSecret access keyを入れて実行してください
- `~/.aws/credentials`がすでに作成されている場合は上書きされるか尋ねられるのでファイルの内容を確認し対応してください

```bash
serverless config credentials --provider aws --key aws_access_key_id --secret aws_secret_access_key
```

- **キー情報が漏洩し悪用されると多額の請求につながる危険性があるので取り扱いには十分気をつけてください**

### AWSにデプロイ

- 準備が整ったので作成した関数をAWSにデプロイします

```bash
serverless deploy
```

- デプロイが成功すると以下のキャプチャのようにエンドポイントのURLが表示されます

![デプロイ結果](/images/2-1.png)

- エラーが出た場合はコンソールに出力されたログをよく確認しましょう

### 動作確認

- エンドポイントのURLに`/hello`をつけてブラウザでアクセスしてみましょう

![ブラウザでアクセス](/images/2-2.png)

- Helloが表示されればOKです

## まとめ

- この章では以下のことを学びました
    - Expressを使って関数を作成する
    - ServerlessFrameworkを使って関数をLambdaにデプロイしAPI Gatewayの設定を行う
    - デプロイしたLambdaにアクセスしてみる

