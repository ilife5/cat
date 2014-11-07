define(["require", "exports", "module", "math"], function(require, exports, module) {

var add = require('math').add;

exports.increment = function(val) {
    return add(val, 1);
};
return module.exports;
}
);