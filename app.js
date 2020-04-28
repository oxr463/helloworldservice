const port = process.env.PORT || 3000;
const mongo_url =
  process.env.MONGO_URL || "mongodb://localhost:27017";
const mongo_debug = process.env.MONGO_DEBUG || false;

var express = require('express'),
    mongoose = require("mongoose"),
    helloworldservice = require('./helloworldservice'),
    app = express();

mongoose.set("debug", mongo_debug);

mongoose.connect(mongo_url, {
  auth: {
    user: process.env.MONGO_USER || "user",
    password: process.env.MONGO_PASSWD || "password"
  },
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  app.use('/helloworldservice', helloworldservice);
  app.listen(port);

  console.log('server running on port ' + port);
});
