'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const bcrypt = require('bcryptjs');

const dbConnection = require('./database/db_connections');
const addtolist = require('./queries/addtolist');
const adduser = require('./queries/adduser');
const checklogin = require('./queries/checklogin');
const checksignup = require('./queries/checksignup');
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

getlist((err, shoppinglist) => {
  if (err) {
    return err;
  }
  else {
    const listResponse = JSON.stringify(shoppinglist);
    res.writeHead(200, 'Content-Type': 'application/json');
    res.end(listResponse);
  };
});

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

  //This will call the checklogin query
  checklogin: (req, res) => {
  },

  // This checks if the user exists (checksignup.js), checks if the passwords match, hashes the password if they match and sends the information to the database (adduser.js).

  adduser: (req, res) => {
    let body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', () => {
      const username = queryString.parse(body).username;
      checksignup(username, (err, dbRes) => {
        if(err) {
          console.log(err);
        } else if (dbRes.rows.length !== 0){
          console.log("I am a username that exists, I come from adduser: ", dbRes.rows)
          res.writeHead(500, 'Content-Type:text/html');
          res.end('<h1>Sorry, this user exists</h1>');
        } else {
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
        }
      })
  });
  },

  //This will call the addtolist query
  addtolist: (req, res) => {

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
