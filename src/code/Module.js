var FileResource, esprima;

FileResource = require('./FileResource');
esprima = require('esprima');

function Module( config ) {
    this.config = config;
    this.dependencies = [];
    this.converted = '';
    this.analysis();
    this.output();
}

/**
 * 分析文件，取出文件的特征
 */
Module.prototype.analysis = function() {
    var fileResource;

    console.log('[log]', 'analysis', this.config.filename);
    fileResource = this.fileResource = new FileResource(this.config);

    fileResource.read();

};

Module.prototype.output = function() {
    this.fileResource.save();
    console.log('[log]', 'save', this.config.filename);
};

Module.prototype.convert = function() {};

module.exports = Module;