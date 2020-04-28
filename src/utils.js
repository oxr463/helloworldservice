const http = require('http');
const querystring = require('querystring');

var logger = function (msg) {
    console.log.apply(this, arguments);
};

var search = function (searchfor, array) {
    for (key in array) {
        if (array[key][searchfor] != undefined) {
            return array[key][searchfor];
        }
    }
    return null;
}

exports.search = search;
exports.logger = logger;
