# cat

nodejs <--> AMD 转换工具

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
