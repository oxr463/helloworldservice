"use strict";

const port = process.env.PORT || 3000;

const express = require("express");

const service = require("./wsdl");

var app = express();

app.use("/helloworldservice", service);
app.listen(port);

console.log("server running on port " + port);
