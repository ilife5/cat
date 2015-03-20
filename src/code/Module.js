var FileResource, esprima, log, chalk;

FileResource = require('./FileResource');
esprima = require('esprima');
log = require('./utils/log');
chalk = require('chalk');

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

    log.info('analysis', this.config.filename);
    fileResource = this.fileResource = new FileResource(this.config);

    fileResource.read();

};

Module.prototype.output = function() {
    this.fileResource.save();
    log.info(chalk.red(chalk.bgYellow('saved')), this.config.filename);
};

module.exports = Module;