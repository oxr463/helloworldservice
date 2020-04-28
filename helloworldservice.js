const async = require('async');
const express = require('express');
const http = require('http');
const parseString = require('xml2js').parseString;
const stripPrefix = require('xml2js').processors.stripPrefix;
const Builder = require('xml2js').Builder;
const fs = require("fs");
const util = require("util");
const url = require('url');
const bodyParser = require('body-parser');
const router = express.Router();

const utils = require('./utils');

var helloworldservice = {};

var servicewsdl = 'helloworld.wsdl';

router.use(bodyParser.text({ type: '*/*' }));
router.use(function timeLogStart(req, res, next) {
    utils.logger('Request start');
    res.locals.startTimeHR = process.hrtime();
    next();
});

// http://localhost:3000/helloworldservice?wsdl
router.get('/', function (req, res, next) {
    utils.logger("GET");
    if (req.query.wsdl === "") {
        res.setHeader('Content-Type', 'application/xml');
        res.statusCode = 200;
        fs.readFile(servicewsdl, "utf8", function (err, data) {
            if (err) {
                endResponse(err);
            } else {
                endResponse(data);
            }
        });
    } else {
        endResponse("Invalid GET request");
    }

    function endResponse(data) {
        res.write(data);
        res.end();
        next();
    }
});

router.post('/', function (req, res, next) {
    utils.logger("POST");
    async.waterfall([
        function (cb) {
            utils.logger('Convert POST request to usable JSON');
            parseString(req.body, { tagNameProcessors: [stripPrefix] }, cb);
        },
        function (result, cb) {
            utils.logger('Processing JSONized XML message');
            var body = result["Envelope"]["Body"];
            var sayHello = utils.search("sayHello", body);
            var firstName = utils.search("firstName", sayHello);
            var firstNameValue = utils.search("_", firstName);
            cb(null, 'Hello ' + firstNameValue);
        }
    ],
        function (err, results) {
            if (err) {
                results = "I don't know your name";
            }
            var builder = new Builder();

            var jsonresponse = {
                "soapenv:Envelope": {
                    "$": {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                        "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                        "xmlns:urn": "urn:examples:helloservice"
                    },
                    "soapenv:Header": [""],
                    "soapenv:Body": [{
                        "urn:sayHelloResponse": [{
                            "$": {
                                "soapenv:encodingStyle": "http://schemas.xmlsoap.org/soap/encoding/"
                            },
                            "greeting": [{
                                "_": results,
                                "$": {
                                    "xsi:type": "xsd:string"
                                }
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
            }

            var xmlresponse = builder.buildObject(jsonresponse);

            utils.logger('Returning response Result: ' + JSON.stringify(results) + ' Error: ' + JSON.stringify(err));

            res.setHeader('Content-Type', 'application/xml');
            res.statusCode = 200;
            res.end(xmlresponse);
            next(err, results);
        }
    );
});

router.use(function timeLogEnd(req, res, next) {
    var durationHR = process.hrtime(res.locals.startTimeHR);
    utils.logger("Request end. Duration: %ds %dms", durationHR[0], durationHR[1] / 1000000);
    next();
});

module.exports = router;
