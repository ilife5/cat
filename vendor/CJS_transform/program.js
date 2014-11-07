define(["require", "exports", "module", "increment"], function(require, exports, module) {

var inc = require('increment').increment;
var a = 1;
inc(a); // 2
return module.exports;
}
);