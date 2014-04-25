var util, _, _path;

util = require('./utils/utils');
_ = require('underscore');
_path = require('path');

function Generator( file ) {
    this.file  = file;
}

function amdGenerator(file) {

    var dependencies, dependenciesStr;

    if(!util.needConverted(file.filename)) {
        return file.resouce;
    }

    dependencies = util.combineDepends(file.defines);

    if(dependencies.length > 0) {
        dependenciesStr = '["require", "exports", "module", ' + _.map(dependencies, function(dep) {
            return '"' + dep + '"';
        }).join(', ') + '], ';
    } else {
        dependenciesStr = '';
    }

    return [
        'define(' + dependenciesStr + 'function(require, exports, module) {\n',
        file.resouce,
        '\nreturn module.exports;',
        '}',
        ');'
    ].join('\n');
}

Generator.prototype.AMD = function() {
    return amdGenerator(this.file);
};

Generator.prototype.nodejs = function() {};

Generator.prototype.generator = function() {
    return this[this.file.config.template]();
};


module.exports = Generator;