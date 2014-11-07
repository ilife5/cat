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

还可以批量对文件夹进行操作，如果我们想把AMD目录下的所有文件进行转化并输出到AMD_transform中，我们输入

```
modules-cat nodejs vendor/AMD -o vendor/AMD_transform
```
