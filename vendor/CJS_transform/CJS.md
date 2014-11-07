# CJS

## CommonJs Modules --> AMD

### 基本方法模块

此类模块使用exports导出方法，特点是无依赖

math.js (CommonJs Module)

```
exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};
```

等价于：

math.js (AMD Module)

```
define([], function() {
	return {
		add : function() {
		    var sum = 0, i = 0, args = arguments, l = args.length;
		    while (i < l) {
		        sum += args[i++];
		    }
		    return sum;
		}
	};
});
```

### 有依赖的方法模块

此类模块依赖其他模块，通过exports导出方法

increment.js (CommonJs Module)

```
var add = require('math').add;
exports.increment = function(val) {
    return add(val, 1);
};
```

等价于

increment.js(AMD Module)

```
define(['require', 'exports', 'module', 'math'], function(require, exports, module) {
    var add = math.add;

    exports.increment = function(val) {
        return add(val, 1);
    };
});
```

### 业务代码，无导出

program.js (CommonJs Module)

```
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
```

program.js (AMD Module)

```
define(['increment'], function(increment) {
    var inc = increment.increment;
    var a = 1;
    inc(a); //2
});
```

## 扩展的CommonJs Module

这里列出扩展过的CommonJs Module的使用方法及AMD Module的转换方法，扩展来源于[fekit](https://github.com/rinh/fekit)，[avalon](https://github.com/RubyLouvre/avalon)。

Calculation.js (extend CommonJs Module)
```
//将构造函数Calculation通过module.exports导出
function Calculation() {
}

Calculation.prototype.add = function(x, y) {
    return x + y;
};

module.exports = Calculation;
```

Calculation.js (AMD Module)
```
define([], function() {
    function Calculation() {
    }

    Calculation.prototype.add = function(x, y) {
        return x + y;
    };

    return Calculation;
});
```

### 无任何导出，功能是执行函数或者向全局对象添加方法

add.js (extend CommonJs Module)
```
//向avalon添加add方法
require('avalon');

function add(){
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
}

avalon.add = add;
```

add.js (AMD Module)
```
//如果avalon并没有
define(['avalon'], function(avalon) {
   function add(){
        var sum = 0, i = 0, args = arguments, l = args.length;
        while (i < l) {
            sum += args[i++];
        }
        return sum;
    }

    avalon.add = add;
});
```

### 作为入口，引入需要的包

common.js (extend CommonJs Module)
```
require('avalon');
require('jquery');
require('./libs/json2');
```

common.js (AMD Module)

```
define(['avalon', 'jquery', './libs/json2'], function(avalon, jquery, json2) {});
```

### 引入string类型的文件

biz.js (extend CommonJs Module)

```
var tpl = require('../templates/start'); //may be ../templates/start.string

//...

$container.append(tpl);

```

biz.js (AMD Module)

```
define(['text!../templates/start'], function (template) {
    //...

    $container.append(template);
});
```