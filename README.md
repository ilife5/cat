# cat

nodejs <--> AMD 转换工具

```
  Usage: modules-cat [options] [command]

  Commands:

    AMD <path>             Converts all modules in <path> using 'AMD' template.
    nodejs <path>          Converts all modules in <path> using 'nodejs' template.

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -o, --dstPath <dstPath>  output converted files onto this directory
    -s, --synchronization    convert amd to commonjs synchronously
```

## 将AMD模块转变为nodejs模块

```
// vendor/AMD/anonymousAlpha.js

define(["alpha"], function (alpha) {
    return {
        verb: function(){
            return alpha.verb() + 2;
        }
    };
});
```

如果想要把这个文件转化并输出到AMD_transform文件夹下我们输入

```
modules-cat nodejs vendor/AMD/anonymousAlpha.js -o vendor/AMD_transform/
```

输出结果为

```
//vendor/AMD_transform/anonymousAlpha.js
var alpha = require("alpha");

module.exports = (
function () {
    return {
        verb: function () {
            return alpha.verb() + 2;
        }
    };
}
)();
```
默认文件转换采用异步的方式，如有需要可以添加-s选项使之同步转换
```
modules-cat nodejs vendor/AMD/anonymousAlpha.js -o vendor/AMD_transform/ -s
```

还可以批量对文件夹进行操作，如果我们想把AMD目录下的所有文件进行转化并输出到AMD_transform中，我们输入

```
modules-cat nodejs vendor/AMD -o vendor/AMD_transform
```

## 将nodejs模块转化为amd模块

```
// vendor/CJS/Calculation.js

//将构造函数Calculation通过module.exports导出
function Calculation() {
}

Calculation.prototype.add = function(x, y) {
    return x + y;
};

module.exports = Calculation;
```

如果想要把这个文件转化为CMD格式并输出到CJS_transform文件夹下我们输入

```
modules-cat amd CJS/Calculation.js -o CJS_transform 
```

输出结果为

```
// vendor/CJS_transform/Calculation.js

define(function(require, exports, module) {

//将构造函数Calculation通过module.exports导出
function Calculation() {
}

Calculation.prototype.add = function(x, y) {
    return x + y;
};

module.exports = Calculation;
return module.exports;
}
);
```

还可以批量对文件夹进行操作，如果我们想把CJS目录下的所有文件进行转化并输出到CJS_transform中，我们输入

```
modules-cat AMD CJS -o CJS_transform/
```