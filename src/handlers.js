
const cookie = require ('cookie');
const verify = require ('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const bcrypt = require('bcryptjs');

'use strict';

const dbConnection = require('./database/db_connections');
const addtolist = require('./queries/addtolist');
const adduser = require('./queries/adduser');
const checkuser = require('./queries/checkuser');
const getlist = require('./queries/getlist');
const validator = require('./validator');
const checkLogin = require('./queries/checklogin');

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
    //check we have a JWT
    const {jwt} = cookie.parse(req.headers.cookie);   ///module name left here for clarity - remove if error!
    if (jwt) {
        verify (jwt, SECRET, (err,jwtContents)) => {
          if (err) {
            send401 ();
          }
          else {   //responsible devs would also test the date/age of the jwt here ;)
            const strippedJwt = {jwtContents.username, jwtContents.hashPassword,  jwtContents.perUserSalt};
            checkLogin (strippedJwt, (err,loggedInUser) => {
              if (err) {
                send401 ();
              }
              else {
                const filePath = path.join(__dirname, "..", "public", "loggedin.html");
                fs.readFile(filePath, (error, file) => {
                  if (error) {
                    res.writeHead(500, {
                      "Content-type": "text/html"
                    });
                    res.end("<h1>So sorry, we've had a problem on our end.</h1>");
                  } else {
                    res.writeHead(200, {
                      ////this is where we'd set a normal basic cookie, after the jwt, just to make username available to frontend (from loggedInUser)
                      "Content-Type": "text/html",
                      "Content-Length" : file.length
                    });
                    res.end(file);
                  }
                });

              }
            });
          });


        }

    }
    else {
      send401 ();
    }

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

  // This checks if the user exists (checkuser.js), checks if the passwords match, hashes the password if they match and sends the information to the database (adduser.js).

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
