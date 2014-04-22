/**
 * 查找文件 ==> 解析文件 ==> 批量输出
 */
 var globExpand, Module, _;

globExpand = require('glob-expand');

Module = require('./Module');

_ = require('underscore');

function Cat( config ) {
    this.config = config;
    this.modules = [];
}

Cat.prototype.build = function() {
    var config = this.config,
        files = globExpand({
            cwd: config.path,
            filter: 'isFile'
        }, '**/*'),
        modules = this.modules,
        _this;

    //如果不存在文件则报错
    if(files.length > 0){
        _.each(files, function(filename) {
            modules.push( new Module( {
                filename: filename,
                cat: _this
            } ) );
        });
    } else {
        console.log('文件夹下没有文件！');
    }

    //config process
    //read a file and parse it

};

module.exports = Cat;