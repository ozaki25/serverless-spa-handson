# 4章 React

## 概要

- SPAを作ってAPIにアクセスしてみます

## ゴール

- ブラウザ上にDynamoDBから取得したデータを表示する

## 登場する技術

- React

### React

- Single Page Applicationを開発するためのJavaScriptのフレームワーク

## ハンズオン

### アプリの雛形生成する

- create-react-appという雛形生成ツールを使う

```bash
npx create-react-app serverless-sample-client
```

- 作成したフォルダに移動しアプリを起動する

```bash
cd serverless-sample-client
yarn start
```

- [http://localhost:3000](http://localhost:3000)にアクセスし以下の画面が表示されればOK
    - 見た目はバージョンによって多少差異があります

![React Hello](/images/4-1.png)

### TODO一覧を取得する

- APIにアクセスしてLambdaを実行しDynamoDBからデータを取得してみます
- `src/App.js`を以下の内容に書き換えてください

```jsx
import React, { useEffect, useState } from 'react';
import './App.css';

// 各自のURLを設定
const url = 'https://xxx.execute-api.ap-northeast-1.amazonaws.com/dev';

// GET:/todoにアクセスする関数
const getTodoList = async () => {
  try {
    const response = await fetch(`${url}/todo`); // URLだけ指定するとGETでアクセスされる
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

function App() {
  // TodoListを入れておく変数と更新する関数
  const [todoList, setTodoList] = useState([]);

  // TODO一覧を再取得する
  const refresh = async () => {
    setTodoList(await getTodoList());
  };

  // ページを表示した時に一度だけ実行される
  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="App">
      {todoList.length ? (
        todoList.map(todo => <p key={todo.id}>{todo.text}</p>)
      ) : (
        <p>Empty</p>
      )}
    </div>
  );
}

export default App;
```

- ページを表示したタイミングで通信処理を呼び出してTODO一覧を取得しています
- ブラウザ上で確認します
- アプリを起動したままであればファイルを保存すると自動でリロードが走りすでに画面が更新されているはずです
- DBに登録したTODOの一覧が表示されていれば成功です

### TODOを追加する

- 新しいTODOをAPIに送信しLambdaを実行しDynamoDBに保存します
- `src/App.js`を以下の内容に書き換えてください

```jsx
import React, { useEffect, useState } from 'react';
import './App.css';

// 各自のURLを設定
const url = 'https://xxx.execute-api.ap-northeast-1.amazonaws.com/dev';

// GET:/todoにアクセスする関数
const getTodoList = async () => {
  try {
    const response = await fetch(`${url}/todo`); // URLだけ指定するとGETでアクセスされる
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

// ↓↓↓追加した関数↓↓↓
// POST:/todoにアクセスする関数
const createTodo = async ({ text }) => {
  try {
    await fetch(`${url}/todo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    console.log(e);
  }
};

function App() {
  // TodoListを入れておく変数と更新する関数
  const [todoList, setTodoList] = useState([]);

　// ↓↓↓追加した処理↓↓↓
  // 入力内容を保存しておく変数
  const [newTodo, setNewTodo] = useState('');

  // ↓↓↓追加した処理↓↓↓
  // 入力内容が変化する度に入力内容をnewTodoに入れる
  const onChange = e => {
    setNewTodo(e.target.value);
  };

  // ↓↓↓追加した処理↓↓↓
  // 作成ボタンがクリックされたらTODOを作成して画面を更新する
  const onClick = async () => {
    await createTodo({ text: newTodo });
    refresh();
    setNewTodo('');
  };

  // TODO一覧を再取得する
  const refresh = async () => {
    setTodoList(await getTodoList());
  };

  // ページを表示した時に一度だけ実行される
  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="App">
      {/* 以下2行を追加  */}
      <input value={newTodo} onChange={onChange} />
      <button onClick={onClick}>作成</button>
      {todoList.length ? (
        todoList.map(todo => <p key={todo.id}>{todo.text}</p>)
      ) : (
        <p>Empty</p>
      )}
    </div>
  );
}

export default App;
```

- 新しく入力域と作成ボタンを追加しました
- 入力域に文字列を入力し作成ボタンを押すとTODOが登録されるはずです
- AWSのマネジメントコンソールにアクセスしてDynamoDBにデータが追加されていることを確認してみましょう

## まとめ

- この章では以下のことを学びました
    - create-react-appを使ってReactアプリを作成する
    - JavaScriptで通信処理を行いデータの取得や送信をする

