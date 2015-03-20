var chalk,
    info,
    warn,
    error;

chalk = require("chalk");
info = chalk.cyan;
warn = chalk.yellow;
error = chalk.red;


module.exports = {
    info: function() {
        console.log.apply(null, [info("[modules-cat info]"), " "].concat(Array.prototype.slice.call( arguments , 0 )))
    },
    warn: function(msg) {
        console.log.apply(null, [warn("[modules-cat warn]"), " "].concat(Array.prototype.slice.call( arguments , 0 )))
    },
    error: function(msg) {
        console.log.apply(null, [error("[modules-cat error]"), " "].concat(Array.prototype.slice.call( arguments , 0 )))
    }
}