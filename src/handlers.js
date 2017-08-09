const dbConnection = require('./database/db_connection');
const fs = require('fs');
const path = require('path');
const addtolist = require('./queries/addtolist');
const adduser = require('./queries/adduser');
const checkuser = require('./queries/checkuser');
const getlist = require('./queries/getlist');
const url = require("url");
const inputValidation = require('./inputValidation');

const contentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const handlers = {
  home: (req, res) => {
    const filePath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(filePath, (error, file) => {
      if (error) {
        res.writeHead(500, {
          "Content-type": "text/html"
        });
        res.end("<h1>So sorry, we've had a problem on our end.</h1>");

      } else {
        res.writeHead(200, {
          "Content-type": "text/html"
        });
        res.end(file);
      }
    });
  },
  assets: (req, res) => {
    const url = req.url;
    const extension = path.extname(url);
    const filePath = path.join(__dirname, "..", "public", req.url);
    fs.readFile(filePath, (error, file) => {
      if (error) {
        res.writeHead(500, {
          "Content-type": "text/html"
        });
        res.end("<h1>So sorry, we've had a problem on our end.</h1>");

      } else {
        res.writeHead(200, {
          "Content-type": contentTypes[extension],
        });
        res.end(file);
      }
    });
  },
  loggedin: (req, res) => {
    //This is where we create our JWT's
    //This will call getlist and load it to the dom on logged-in.html
  },
  signup: (req, res) => {
    //This will redirect us to the signup page
  },
  checkuser: (req, res) => {
    //This will call the checkuser query
  },
  adduser: (req, res) => {
    //This will call the add user query
  },
  addtolist: (req, res) => {
    //This will call the addtolist query
  },
  // Add more endpoints

  notFound: (req, res) => {
    res.writeHead(404, {
      "Content-type": "text/html"
    });
    res.end("<h1>Sorry, this page doesn't exist</h1>");
  }
}

module.exports = handlers;
