/**
 * 查找文件 ==> 解析文件 ==> 批量输出
 */
var globExpand, Module, _, fs, _path, log;

globExpand = require('glob-expand');

Module = require('./Module');

_ = require('underscore');

fs = require('fs');

_path = require('path');

log = require('./utils/log')

function Cat( config ) {
    this.config = config;
    this.modules = [];
}

Cat.prototype.build = function() {
    var config = this.config,
        files = [],
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
    
    function fileConvert(stat) {
        if(stat.isFile(config.path)) {
            new Module( {
                filename: _path.basename(config.path),
                filePath: config.path,
                cat: _this,
                template: config.template,
                dstPath: config.dstPath
            } );
        } else if(stat.isDirectory()) {
            files = globExpand({
                cwd: config.path,
                filter: 'isFile'
            }, '**/*');

            //如果不存在文件则报错
            if(files.length > 0){
                _.each(files, function(filename) {
                    new Module( {
                        path: config.path,
                        filename: filename,
                        filePath: _path.join(config.path, filename),
                        cat: _this,
                        template: config.template,
                        dstPath: config.dstPath
                    } );
                });
            } else {
                log.error('No files found!');
            }
        }
    }
};

module.exports = Cat;
