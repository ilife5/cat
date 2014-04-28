var _uberscore, esprima, _, _path, NEED_CONVERTED;

NEED_CONVERTED = ['.js'];

_uberscore = require('uberscore');
esprima = require('esprima');
_ = require('underscore');
_path = require('path');


/**
 * 判断当前语句是否为define
 * @param expression
 * @returns {*}
 */
function isDefineStatement(expression) {

    var callee, type;

    type = expression.type;
    callee = expression.callee;

    return type === "CallExpression" && callee && callee.type === 'Identifier' && callee.name === "define";
}

/**
 * 判断当前语句是否为require
 * @param expression
 * @returns {boolean|*|boolean|boolean}
 */
function isRequireStatement(expression) {

    var callee, type;

    type = expression.type;
    callee = expression.callee;

    return type === "CallExpression" && callee && callee.type === 'Identifier' && callee.name === "require";

}

/**
 * 判断当前语句是否为原子值
 * @param expression
 * @returns {boolean}
 */
function isArgumentsLiteral(expression) {

    return expression.arguments && expression.arguments[0].type === 'Literal';

}

/**
 * 判断当前语句是函数
 * @param expression
 * @returns {boolean}
 */
function isArgumentsArray(expression) {
    return expression.arguments && expression.arguments[0].type === 'ArrayExpression';
}

/**
 * 判断当前语句是否为赋值
 * @param expression
 * @returns {boolean|*|Function|left|jQuery.offset.left|jQuery.position.left|testFixture.expression.left.left|testFixture.expression.left|testFixture.expression.right.value.body.expression.left|testFixture.expression.right.left|testFixture.expression.test.left|testFixture.test.left|testFixture.init.left|testFixture.left|testFixture.left.init.body.argument.left|testFixture.expression.body.argument.left|testFixture.body.expression.left|testFixture.argument.left|parentOffset.left|.runtimeStyle.left|node.style.left|pos.left|elem.runtimeStyle.left|elem.style.left|props.left|parentOffset.left|boolean}
 */
function isAssignmentExpression(expression) {

    var left;

    left = expression.left;
    return expression.type === 'AssignmentExpression' && left && left.type === 'Identifier';

}

/**
 * 判断当前语句是否为声明
 * @param expression
 */
function isVariableDeclarator(expression) {
    var id;

    id = expression.id;
    return expression.type === 'VariableDeclarator' && id && id.type === 'Identifier';
}

/**
 * 合并依赖
 * @param depends
 */
function combineDepends( depends ) {
   var deps, items;

    deps = [];

    _.each(depends, function(ex) {
        items = [];
        switch (ex.type) {
            case 'Literal':
                items = _.map(ex.value.split(','), function(v) {
                    return v.trim();
                });
                break;
            case 'ArrayExpression':
                items = _.map(ex.elements, function(v) {
                    return v.value.trim();
                });
                break;
        }

        deps = _.union(deps, items)
    });

    return deps;
}

function needConverted(filename) {
    return _.indexOf(NEED_CONVERTED, _path.extname(filename)) > -1;
}

function canBeRequired(dep) {
    return _.indexOf(['require', 'exports', 'module'], dep) === -1;
}

//返回expression是否为exports语句
function isExportsStatement(expression) {

    var type, object, property;

    type = expression.type;
    object = expression.object;
    property = expression.property;

    return type === 'MemberExpression' && object && object.name === 'exports' && property && property.type === 'Identifier';

}

//返回expression是否为module.exports语句
function isModuleExportsStatement(expression) {

    var type, object, property;

    type = expression.type;
    object = expression.object;
    property = expression.property;

    return type === 'MemberExpression' && object && object.name === 'module' && property && property.type === 'Identifier' && property.name === 'exports';
}

//获取需要声明的依赖变量
function getRealRequires(dependencies, parameters) {

    var depLen, paramsLen, len, i, deps;

    depLen = dependencies.length;
    paramsLen = parameters.length;
    len = depLen >= paramsLen? depLen: paramsLen;
    deps = [];

    for(i = 0; i < len; i++) {
        deps.push([dependencies[i] && dependencies[i].trim(), parameters[i] && parameters[i].trim()]);
    }

    return deps;
}

module.exports = {
    isDefineStatement: isDefineStatement,
    isRequireStatement: isRequireStatement,
    isArgumentsLiteral: isArgumentsLiteral,
    isArgumentsArray: isArgumentsArray,
    isAssignmentExpression: isAssignmentExpression,
    isModuleExportsStatement: isModuleExportsStatement,
    isVariableDeclarator: isVariableDeclarator,
    isExportsStatement: isExportsStatement,
    combineDepends: combineDepends,
    needConverted: needConverted,
    getRealRequires: getRealRequires,
    canBeRequired: canBeRequired
};