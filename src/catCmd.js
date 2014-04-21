#!/usr/bin/env node

/**

 modules-cat <operator>

 */

var program,
    templates,
    _i,
    _len,
    config,
    tmplt;

config = {};

program = require('commander').version('0.0.0').
    option('-o, --dstPath <dstPath>', 'output converted files onto this directory');

templates = ['AMD', 'nodejs'];

function _fn(tmplt) {
    return program.command("" + tmplt + " <path>").description("Converts all modules in <path> using '" + tmplt + "' template.").action(function(path) {
        config.template = tmplt;
        return config.path = path;
    });
}

for (_i = 0, _len = templates.length; _i < _len; _i++) {
    tmplt = templates[_i];
    _fn(tmplt);
}


program.parse(process.argv);

console.log(commander);