#!/usr/bin/env node

/**

 modules-cat <operator> [options]

 */

var program,
    templates,
    _i,
    _len,
    config,
    tmplt,
    Cat,
    _,
    cmdOptions,
    _path;

Cat = require('./Cat');

_path = require('path');

_ = require('underscore');

config = {};

program = require('commander').version('0.0.6').
    option('-o, --dstPath <String>', 'output converted files onto this directory').
    option('-s, --synchronization', 'convert amd to commonjs synchronously').
    option('-S, --staticFiles <string>', 'files not to be transformed').
    option('-i, --ignore <String>', 'files to be ignored');

templates = ['AMD', 'nodejs'];

function _fn(tmplt) {
    return program.command("" + tmplt + " <path>").description("Converts all modules in <path> using '" + tmplt + "' template.").action(function(path) {
        config.template = tmplt;
        return config.path = _path.resolve(path);
    });
}

for (_i = 0, _len = templates.length; _i < _len; _i++) {
    tmplt = templates[_i];
    _fn(tmplt);
}

program.parse(process.argv);

cmdOptions = _.map(program.options, function(option) {
    return option.long.slice(2);
});

_.extend(config, _.pick(program, cmdOptions));

//build
var cat = new Cat(config);

cat.build();

