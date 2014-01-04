[![NPM](https://nodei.co/npm/baidu-push.png?downloads=true)](https://nodei.co/npm/baidu-push/)

### baidu-push

node.js sdk for baidu push service

```bash
npm install baidu-push
```

### 百度云推送

### 使用
* [参考代码](test/test.js)

```js
var Push = require('baidu-push')

var userId = 'a userId'

var pushOption = {
  apiKey: 'your api key',
  secretKey: 'your secret key'
}

var client = new Push(pushOption)
```

根据 userId 向某一 user 推送消息
```js
var option = {
  push_type: 1,
  user_id: userId,
  messages: ["hello"],
  msg_keys: ["title"]
}

client.pushMessage(option, function(error, result) {
  if (error) console.log(error)
})
```

根据 tag 向一群 users 推送消息
```js
var option = {
  push_type: 2,
  tag: testTag.name,
  messages: ["push by tag"],
  msg_keys: ["title"]
}
client.pushMessage(option, function(error, result) {
  if (error) return console.log(error)
})
```

添加user的tag
```js
var option = {
  tag: testTag.name,
  user_id: userId
}
client.setTag(option, function(error, result) {
  if (error) return console.log(error)
})
```

获取user的tag
```js
var option = {
  user_id: userId
}
client.queryTag(option, function (error, result) {})
```

删除user的tag
```js
var option = {
  tag: testTag.name,
  user_id: userId
}
client.deleteTag(option, function(error, result) {})
```

获取app的tag
```js
client.fetchTag({}, function (error, result) {})
```

```js
var option = {
  user_id: userId
}
client.queryBindList(option, function(error, result) {})
```
