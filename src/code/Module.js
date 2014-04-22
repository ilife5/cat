var fileResource;

fileResour = require('./FileResource');

function Module( config ) {
    this.config = config;
}

/**
 * 分析文件，取出文件的特征
 */
Module.prototype.analysis = function() {};

Module.prototype.output = function() {};

Module.prototype.convert = function() {};

module.exports = Module;