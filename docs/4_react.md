# 4章 React

## 概要

- SPAを作ってAPIにアクセスしてみます

## ゴール

- ブラウザ上にDynamoDBから取得したデータを表示する

## メモ

- 実行コマンド

```bash
create-react-app serverless-sample-client
cd serverless-sample-client
```

- 起動確認

```bash
yarn start
open http://localhost:3000
```

- src/App.js

```jsx
import React, { useEffect, useState } from 'react';
import './App.css';

// URLは環境変数で設定
const url = process.env.REACT_APP_API_URL;

function App() {
  // TodoListを入れておく変数と更新する関数
  const [todoList, setTodoList] = useState([]);

  const fetchTodoList = async () => {
    try {
      const response = await fetch(`${url}/todo`);
      const json = await response.json();
      setTodoList(json);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // ページを表示した時に一度だけ実行される
    fetchTodoList();
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

- .env

```
REACT_APP_API_URL=https://xxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev
```