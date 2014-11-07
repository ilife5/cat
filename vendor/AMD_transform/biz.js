var template = "<!-- template start -->\n<div>\n    <p>这是一个模板文件</p>\n</div>\n<!-- template end -->",
jquery = require("jquery");

module.exports = (
function () {
    var $container = $('container');
    $container.append(template);
}
)();