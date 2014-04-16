# cat

nodejs <--> AMD 转换工具

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
define({
	add : function() {
	    var sum = 0, i = 0, args = arguments, l = args.length;
	    while (i < l) {
	        sum += args[i++];
	    }
	    return sum;
	}
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
define(['math'], function(math) {
    var add = math.add;
    return {
        increment : function(val) {
            return add(val, 1);
        }
    };
}); 
```

## 扩展的CommonJs Module

这里列出扩展过的CommonJs Module的使用方法及AMD Module的转换方法，扩展来源于[fekit](https://github.com/rinh/fekit)，[avalon](https://github.com/RubyLouvre/avalon)。



## AMD Usage

创建一个id为"alpha"的模块，使用了require，exports，和id为"beta"的模块:

```
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
   exports.verb = function() {
       return beta.verb();
       //Or:
       return require("beta").verb();
   }
});
```

返回对象字面量的匿名模块：

```
define(["alpha"], function (alpha) {
   	return {
	    verb: function(){
	    	return alpha.verb() + 2;
	    }
   	};
});
```

没有依赖的模块可以用来直接定义对象字面量：

```
define({
	add: function(x, y){
		return x + y;
	}
});
```

使用简单CJS包装定义模块

```
define(function (require, exports, module) {
	var a = require('a'),
		b = require('b');

	exports.action = function () {};
});
```

## Modules 1.1.1 Usage

math.js

```
exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};
```

increment.js

```
var add = require('math').add;
exports.increment = function(val) {
    return add(val, 1);
};
```

program.js

```
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
 
module.id == "program";
```

## CMD Usage

math.js
```js
define(function(require, exports, module) {
  exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
      sum += args[i++];
    }
    return sum;
  };
});
```

increment.js
```js
define(function(require, exports, module) {
  var add = require('math').add;
  exports.increment = function(val) {
    return add(val, 1);
  };
});
```

program.js
```js
define(function(require, exports, module) {
  var inc = require('increment').increment;
  var a = 1;
  inc(a); // 2

  module.id == "program";
});
```


**Wrapped modules with non-function factory**

object-data.js
```js
define({
    foo: "bar"
});
```

array-data.js
```js
define([
    'foo',
    'bar'
]);
```

string-data.js
```
define('foo bar');

```

## avalon加载器模块标识

具体约定如下：

1. 每个模块标识的字符串组成只能是合法URL路径，因此只能是英文字母，数字，点号，斜扛，#号。
1. 如果模块标识是 以"./"开头，则表示相对于它的父模块的目录中找。
1. 如果模块标识是 以"../"开头，则表示相对于它的父模块的父目录中找。
1. 如果模块标识不以点号或斜扛开始，则有以下三种情况 
    1. 如果此模块标识在 $.config.alias存在对应值，换言之某一模块定义了一个别名，则用此模块的具体路径加载文件。
    1. 如果此模块标识 以http://、https://、file:/// 等协议开头的绝对路径，直接用它加载文件。
    1. 否则我们将在引入框架种子模块（avalon.js）的目录下寻找是否有同名JS文件，然后指向它。
1. 对于JS模块，它可以省略后缀名，即“.js”可有可无；但对于CSS需要使用css!插件机制。
1. 框架种子模块的目录保存于 $.config.base属性中。
1. ready!是系统占位符，用于表示DOM树是否加载完毕，不会进行路径转换。
