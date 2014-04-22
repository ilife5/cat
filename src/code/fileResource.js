var fs;

fs = require('fs');

function FileResource( config ) {
    this.config = config;
}

FileResource.prototype.read = function() {};

FileResource.prototype.save = function() {};

module.exports = FileResource;