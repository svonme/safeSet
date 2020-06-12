# safeSet

一个很容易对多层对象进行创建且赋值的工具

`$ npm install @fengqiaogang/safe-set`

```

const safeSet = require("@fengqiaogang/safe-set");

const data = {};
const value = safeSet(data, "a.b.c[1].d", "hello world");

//输出结果
value = {
  "a": {
    "b": {
      "c": [
        null,
        {
          "d": "hello world"
        }
      ]
    }
  }
};
```


