var fs, _path, esprima, uberscore, util, _, Generator, mkdirp, escodegen;

fs = require('fs');
_path = require('path');
esprima = require('esprima');
uberscore = require('uberscore');
util = require('./utils/utils');
_ = require('underscore');
Generator = require('./Generator');
mkdirp = require('mkdirp');
escodegen = require('escodegen');

function FileResource( config ) {
    this.config = config;
    this.hasError = false;      //记录是否转化有问题
    this.noTrans = false;       //记录是否不需要转化
    this.defines = [];
    this.requires = [];
    this.defineContext = {
        dependencies: [],
        parameters: [],
        factoryBody: '',
        factoryType: '',
        useExports: false,
        useModule: false
    };
    this.reply = [];
}

FileResource.prototype.read = function() {

    var filepath, AST_top, AST_body, defines, reply, _this, definesExpression, _factoryBody, _dependenciesBody, requires;

    _this = this;
    defines = this.defines;
    requires = this.requires;
    reply = this.reply;

    //拼接文件路径
    filepath = _path.join(this.config.path, this.config.filename);

    try {
        this.resource = fs.readFileSync(filepath, {
            encoding: 'utf8'
        });

        AST_top = esprima.parse( this.resource, {range: true, tokens: true, comment: true} );

        AST_body = AST_top.body;

        //查找define
        _.each(AST_body, function(ast) {
            if(ast.expression && util.isDefineStatement(ast.expression)) {
                defines.push(ast.expression);
            }
        });

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

                    requires.push(requireDep);
                }
            }

            if(src[prop].type === 'AssignmentExpression' && src[prop].left) {
                if(util.isExportsStatement(src[prop].left)) {
                    _this.defineContext.useExports = true;
                } else if(util.isModuleExportsStatement((src[prop].left))) {
                    _this.defineContext.useModule = true;
                }
            }
            return null;
        });

        if(defines.length === 1) {
            this.kind = 'AMD';
            //抽取信息，顺序：define中的参数 ==> 依赖关系 ==> factory(可以是对象字面量) ==> parameters
            definesExpression = defines[0];

            //抽取信息
            switch(definesExpression.arguments.length) {
                case 1:
                    _factoryBody = definesExpression.arguments[0];
                    break;
                case 2:
                    _dependenciesBody = definesExpression.arguments[0];
                    _factoryBody = definesExpression.arguments[1];
                    break;
                case 3:
                    _dependenciesBody = definesExpression.arguments[1];
                    _factoryBody = definesExpression.arguments[2];
                    break;
                default:
                    throw new Error('Arguments length is illegal!');

            }

            if(_dependenciesBody) {
                //依赖
                switch(_dependenciesBody.type) {
                    case 'Literal':
                        this.defineContext.dependencies = _.map(_dependenciesBody.value.split(','), function(v) {
                            return v.trim();
                        });
                        break;
                    case 'ArrayExpression':
                        this.defineContext.dependencies = _.map(_dependenciesBody.elements, function(v) {
                            return v.value.trim();
                        });
                        break;
                }
            }

            //factory
            if(_factoryBody.type === 'FunctionExpression') {

                var special = this.defineContext.useExports || this.defineContext.useModule,
                    tree;

                //parameters
                this.defineContext.parameters = _.map(_factoryBody.params, function(v) {
                    return v.name.trim();
                })

                if(special) {
                    tree = escodegen.attachComments({
                        type: "Program",
                        body: _factoryBody.body.body,
                        range: _factoryBody.body.range
                    }, AST_top.comments, AST_top.tokens);
                } else {
                    _factoryBody.params.length = 0;
                    tree = escodegen.attachComments(_factoryBody, AST_top.comments, AST_top.tokens);
                }
                this.defineContext.factoryBody = escodegen.generate(tree, {comment: true});
                this.defineContext.factoryType = 'Function';

            } else if(_factoryBody.type === 'ObjectExpression') {
                this.defineContext.factoryBody = escodegen.generate(_factoryBody);
                this.defineContext.factoryType = 'Object';
            } else {
                throw new Error('Argument has wrong type!');
            }

        } else if(defines.length === 0) {
            this.kind = 'nodejs';
        } else {
            this.hasError = true;
        }

    } catch(e) {
        this.hasError = true;
        console.error(e)
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