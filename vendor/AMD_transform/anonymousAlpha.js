var alpha = require("alpha");

module.exports = (
function () {
    return {
        verb: function () {
            return alpha.verb() + 2;
        }
    };
}
)();