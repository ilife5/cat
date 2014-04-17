## AMD Modules --> CommonJs Modules

### 使用了id, dependencies, factory的module

alpha.js (AMD Module)
```
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
   exports.verb = function() {
       return beta.verb();
   }
});
```

转换为：

alpha.js (CommonJs Module)
```
var beta = require('beta');

exports.verb = function() {
    return beta.verb();
};
```

### 返回对象字面量的匿名模块

alpha.js (AMD Module)
```
define(["alpha"], function (alpha) {
    return {
        verb: function(){
            return alpha.verb() + 2;
        }
    };
});
```

转换为：

alpha.js (CommonJs Module)
```
var alpha = require('alpha');

exports.verb = function() {
    return alpha.verb() + 2;
};

```

### 定义没有依赖的对象字面量

Math.js (AMD Module)
```
define({
    add: function(x, y){
        return x + y;
    }
});
```

转换为：

Math.js (CommonJs Module)
```
exports.add = function(x, y) {
    return x + y;
};
```

### 使用CommonJs wrapper 定义的模块

action.js (AMD Module)
```
define(function (require, exports, module) {
    var a = require('a'),
        b = require('b');

    exports.action = function () {};
});
```

action.js (CommonJs Module)
```
var a = require('a'),
    b = require('b');

exports.action = function () {};

```

### 使用text!插件

biz.js (AMD Module)

```
define(['text!../templates/start'], function (template) {
    //...

    $container.append(template);
});
```

biz.js (CommonJs Module)

```
var tpl = require('../templates/start');

//...

$container.append(tpl);
```
