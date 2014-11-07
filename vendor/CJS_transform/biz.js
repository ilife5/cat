define(["require", "exports", "module", "jquery", "../templates/start"], function(require, exports, module) {

require('jquery');
var tpl = require('../templates/start'); //may be ../templates/start.string

var $container = $('container');

$container.append(tpl);
return module.exports;
}
);