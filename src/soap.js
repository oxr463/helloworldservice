const http = require("http");
const soap = require("soap");

const PORT = 3000;

var helloworldservice = {
  Hello_Service: {
    Hello_Port: {
      sayHello: function (args, callback) {
        console.log("sayHello: " + JSON.stringify(args));
        callback({ greeting: "Hello " + args.firstName.$value });
      },
    },
  },
};

var wsdl = require("fs").readFileSync("./wsdl.xml", "utf8");

var server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});

server.listen(PORT);
console.log("server running on port " + PORT);

soap.listen(server, "/helloworldservice", helloworldservice, wsdl);
