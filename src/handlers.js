'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const bcrypt = require('bcryptjs');

const dbConnection = require('./database/db_connections');
const addtolist = require('./queries/addtolist');
const adduser = require('./queries/adduser');
const checkuser = require('./queries/checkuser');
const getlist = require('./queries/getlist');
const validator = require('./validator');

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

  //This will redirect us to the signup page
  signup: (req, res) => {
    const filePath = path.join(__dirname, "..", "public", "signup.html");
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

  //This will call the checkuser query
  checkuser: (req, res) => {
  },

  //This will call the add user query
  adduser: (req, res) => {
    let body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', () => {
      const username = queryString.parse(body).username;
      const password = queryString.parse(body).password;
      const confirmPassword = queryString.parse(body).confirmPassword;
      console.log(username, password, confirmPassword);
      if (password === confirmPassword) {
        const hashPassword = (password, callback) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) callback(err);
          callback(null, hash);
        });
      };

      hashPassword(password, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('i am hashed password:', result);
          const hashedPassword = result;
          adduser(username, hashedPassword, (err, dbRes) => {
            if (err) {
              res.writeHead(500, 'Content-Type:text/html');
              res.end('<h1>Sorry, there was a problem adding the user</h1>');
              console.log(err)
            };
          })
          res.writeHead(200, {
            'Content-type': 'text/html'
          });
          fs.readFile(__dirname + "/../public/loggedin.html", function(error, file) {
            if (error) {
              console.log(error);
              return;
            } else {
              res.end(file)
            }
          })
        }
      });
    };
  });
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
