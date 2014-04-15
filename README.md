cat

===============


nodejs <--> AMD 转换工具

h1 AMD Usage

Sets up the module with ID of "alpha", that uses require, exports and the module with ID of "beta":
```
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
   exports.verb = function() {
       return beta.verb();
       //Or:
       return require("beta").verb();
   }
});
```

An anonymous module that returns an object literal:

```
define(["alpha"], function (alpha) {
   	return {
	    verb: function(){
	    	return alpha.verb() + 2;
	    }
   	};
});
```

A dependency-free module can define a direct object literal:

```
define({
	add: function(x, y){
		return x + y;
	}
});
```

A module defined using the simplified CommonJS wrapping:

```
define(function (require, exports, module) {
	var a = require('a'),
		b = require('b');

	exports.action = function () {};
});
```
