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