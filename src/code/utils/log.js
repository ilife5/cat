var chalk,
    info,
    warn,
    error;

chalk = require("chalk");
info = chalk.cyan;
warn = chalk.yellow;
error = chalk.red;

/**
 * convert arguments object to array
 */
function getArguments(ar) {
    return Array.prototype.slice.call( ar , 0 );
}

module.exports = {
    info: function() {
        console.log.apply(null, [info("[modules-cat info]"), " "].concat( getArguments(arguments) ))
    },
    warn: function(msg) {
        console.log.apply(null, [warn("[modules-cat warn]"), " "].concat( getArguments(arguments) ))
    },
    error: function(msg) {
        console.log.apply(null, [error("[modules-cat error]"), " "].concat( getArguments(arguments) ))
    }
}