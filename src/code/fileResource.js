var fs, _path, esprima, uberscore, util, _, Generator, mkdirp;

fs = require('fs');
_path = require('path');
esprima = require('esprima');
uberscore = require('uberscore');
util = require('./utils/utils');
_ = require('underscore');
Generator = require('./Generator');
mkdirp = require('mkdirp');

function FileResource( config ) {
    this.config = config;
    this.hasError = false;      //记录是否转化有问题
    this.noTrans = false;       //记录是否不需要转化
    this.defines = [];
    this.reply = [];
}

FileResource.prototype.read = function() {

    var filepath, AST_top, AST_body, _i, defines, reply, _this;


    _this = this;
    defines = this.defines;
    reply = this.reply;

    //拼接文件路径
    filepath = _path.join(this.config.path, this.config.filename);

    try {
        this.resouce = fs.readFileSync(filepath, {
            encoding: 'utf8'
        });

        AST_top = esprima.parse( this.resouce );

        AST_body = AST_top.body;

        //查找define
        _.each(AST_body, function(ast) {
            if(ast.expression && util.isDefineStatement(ast.expression)) {
                defines.push(ast.expression);
            }
        });

        if(defines.length === 1) {
            this.kind = 'AMD';
        } else if(defines.length === 0) {
            this.kind = 'nodejs';
        } else {
            this.hasError = true;
        }

        //查找依赖
        uberscore.traverse(AST_body, function(prop, src) {
            var requireDep, requireVar;

            //是否为require语句
            if(util.isRequireStatement(src[prop])) {
                if(util.isArgumentsLiteral(src[prop]) || util.isArgumentsArray(src[prop])) {
                    requireDep = _.extend({}, src[prop].arguments[0]);
                } else {
                    return null;
                }

                if(util.isAssignmentExpression(src)) {
                    requireVar = src.left.name;
                } else if(util.isVariableDeclarator(src)) {
                    requireVar = src.id.name;
                }

                if(requireDep) {
                    if(requireVar) {
                        reply.push(requireVar);
                    }

                    defines.push(requireDep);
                }
            }

            return null;
        });

    } catch(e) {
        this.hasError = true;
    }
};

FileResource.prototype.save = function() {
    var generator, source, fileName, fileDirName;

    generator = new Generator(this);
    source = generator.generator();
    fileName = _path.join(this.config.dstPath, this.config.filename);

    try{
        if(!fs.existsSync(fileDirName = _path.dirname(fileName))) {
            mkdirp.sync(fileDirName);
        }

        fs.writeFileSync(fileName, source, {
            encoding: 'utf8'
        });
    } catch(e) {
        console.error(e.stack);
    }


};

module.exports = FileResource;