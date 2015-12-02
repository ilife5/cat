/**
 * 查找文件 ==> 解析文件 ==> 批量输出
 */
var globExpand, Module, _, fs, _path, log, minimatch;

globExpand = require('glob-expand');

Module = require('./Module');

_ = require('underscore');

fs = require('fs');

_path = require('path');

log = require('./utils/log');

minimatch = require('minimatch');

function Cat( config ) {
    this.config = config;
    this.modules = [];
}

Cat.prototype.build = function() {
    var config = this.config,
        files = this.files = [],
        modules = this.modules,
        _this = this,
        syncConvert = config.synchronization;

    if (syncConvert) {
        var stat = fs.lstatSync(config.path)
        fileConvert(stat)
    } else {
        fs.lstat(config.path, function(err, stat) {
            if(!err) {
                fileConvert(stat)    
            } else {
                console.log(err)
            }
        })
    }

    //文件转换，包括对文件的读取与写入
    function fileConvert(stat) {

        var ignoreList = config.ignore ? config.ignore.split(","): [];

        //使用minimatch做文件排除，见https://github.com/isaacs/minimatch#nonegate
        ignoreList = ignoreList.map(function(ignore) {
            return "!" + ignore
        })

        if(stat.isFile(config.path) && !(config.ignore.some && config.ignore.some(function(pattern) {
                    return minimatch(config.path, pattern)
                }))) {
            var filename = _path.basename(config.path)
            files.push(filename)
            new Module( {
                filename: filename,
                filePath: config.path,
                cat: _this,
                template: config.template,
                dstPath: config.dstPath,
                staticFiles: config.staticFiles
            } );
        } else if(stat.isDirectory()) {
            _this.files = files = globExpand({
                cwd: config.path,
                filter: 'isFile'
            }, ['**/*'].concat(ignoreList));
            //如果不存在文件则报错
            if(files.length > 0){
                _.each(files, function(filename) {
                    new Module( {
                        path: config.path,
                        filename: filename,
                        filePath: _path.join(config.path, filename),
                        cat: _this,
                        template: config.template,
                        dstPath: config.dstPath,
                        staticFiles: config.staticFiles
                    } );
                });
            } else {
                log.error('No files found!');
            }
        }
    }
};

module.exports = Cat;
