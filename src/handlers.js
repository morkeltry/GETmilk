
const cookie = require ('cookie');
const JWT = require ('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const bcrypt = require('bcryptjs');

'use strict';

const dbConnection = require('./database/db_connections');
const addtolist = require('./queries/addtolist');
const adduser = require('./queries/adduser');
const checklogin = require('./queries/checklogin');
const checksignup = require('./queries/checksignup');
const getlist = require('./queries/getlist');
const validator = require('./validator');
const checkLogin = require('./queries/checklogin');
const SECRET = "This is a secret. Don't put it in the code";

const contentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

// getlist((err, shoppinglist) => {
//   if (err) {
//     return err;
//   }
//   else {
//     const listResponse = JSON.stringify(shoppinglist);
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end(listResponse);
//   };
// });


function send401 (response,message) {
  message = message || 'fail!';
  response.writeHead (401,{
    "Content-Type" : "text/plain",
    "Content-Length" : message.length
  });
  response.end (message);
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
        console.log ('Got to /loggedin. Found a jwt.')
        JWT.verify (jwt, SECRET, (err,jwtContents) => {
          if (err) {
            send401 (res,'fake jwt!');
          }
          else {   //responsible devs would also test the date/age of the jwt here ;)
            console.log ("Here's yer opened jwt, just to be clear ...",jwtContents)
            const strippedJwt = {
                    username: jwtContents.username || '',     // remove the ||'' to get useful errors
                    hashedPw: jwtContents.hashedPw    ///now unneeded
                  };
            checkLogin (strippedJwt, (err,loggedInUser) => {
              if (err) {
                console.log (err);
                send401 (res,'bcrypt error - bad jwt.');
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
                      // "Set-Cookie": "username="+jwtContents.username,
                      ////original plan was to set a normal basic cookie, after the jwt, just to make username available to frontend (from loggedInUser)
                      "Content-Type": "text/html",
                      "Content-Length" : file.length
                    });
                    res.end(file);
                  }
                });
              }
            });
          }
        });
    }
    else {
      send401 (res,'this is not a jwt cookie - you should be redirected painlessly! - Soorry :P');
    }

    //This will call getlist and load it to the dom on logged-in.html
    const filePath = path.join(__dirname, "..", "public", "loggedin.html");
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


  login: (req,res) => {
    console.log ('\n\n\n\nLogin request beginning');
    let body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', () => {
      console.log ('Received login request');
      console.log ('body: ',body);
      const username = queryString.parse(body).username;
      const password = queryString.parse(body).password;
      console.log (username, password);
      checkLogin ({username}, (err, retreived) => {    ///was : {username, hashedPw}
        if (err) {
          if (err.code == '42P01'){
            console.log ('DB connection error. Are you sure you want to connect to ', dbConnection.options.database,' ?');
          } else {
            console.log ('Err:', err.message);        //eg Passwords do not match
            console.log ('Sending you to /loginerror');
            console.log (res._header);
            res.writeHead(302, {
              // 'Content-type': 'text/html',
              'Location': '/loginerror'        //eg User not found
            });
            console.log ('Still sending you to /loginerror');
            console.log (res._header);
            res.end();
            }
          } else {

    if (err) console.log ('Ignoring ',err.name,'. Pushing on through...');
    // goodLogin={username, cleartextPassword:'xbVhashyhashPASSWORDhashsmashbash6Fdm'};  //(fake!)

            bcrypt.compare(password,retreived.hashedPw, (err,hashedPw) => {
            if (err) {
              cb (new RangeError ('wrong password - hash('+password+')     !=     '+trippedJwt.hashedPw));
            } else

            if (retreived) {
              JWT.sign(retreived, SECRET, (err, token) => {     ///Still stores the hashedPw
                                                                /// which is no use - just needs the uname
                if (err) {throw new Error('jwt broke. Ooopsy woo..')};
                //if you got to here, that all worked. Time to report back :)
                console.log('Signed. New jwt = ',token,' from',retreived);
                res.writeHead(302, {
                "Content-type": "text/html",
                "Location": "/loggedin",
                "Set-Cookie": "jwt="+token+';Max-Age=450'
                  });
                res.end("<h1>So sorry, we've had a problem on our end.</h1>");


              });



            }
            else {throw new Error('Error should have been thrown already! WTF?');}


          console.log ('Should have redirected you by now. Maybe your 302 header got intercepted.');
          });
        }
      });


    });


    /////Commented out as it seems to intercept the 302 header even after res.end()
    //
    // const filePath = path.join(__dirname, "..", "public", "index.html");
    // fs.readFile(filePath, (error, file) => {
    //   if (error) {
    //     res.writeHead(500, {
    //       "Content-type": "text/html"
    //     });
    //     res.end("<h1>So sorry, we've had a problem on our end.</h1>");
    //   } else {
    //     res.writeHead(200, {
    //       "Content-type": "text/html"
    //     });
    //     res.end(file);
    //   }
    // });


  },


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
    let body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', () => {
      const content = queryString.parse(body).content;
      addtolist(content, (err, dbres) => {
        if(err) {
          res.writeHead(500, {
            'Content-Type': 'text/html'
          })
          res.end('<h1>The list is full</h1>')
        } else {
          res.writeHead(302, {
            'Location': '/loggedin'
          })
          res.end();
        }

      });
      console.log(content);
});
  },

  loginerror: (req,res,message) => {
  console.log ('Hello... this is /loginerror\nMessage: ',message)
    const filePath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(filePath, (error, file) => {
        res.writeHead(403, {
          "Content-type": "text/html"
        });
        res.end(file);
    });
  },




  getlist: (req, res) => {
    getlist((err, shoppinglist) => {
      console.log(shoppinglist);
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/html'
        })
        res.end('<h1>Im sorry the shops are closed</h1>')
      } else {
        const listResponse = JSON.stringify(shoppinglist);
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log('Im the list response ', listResponse);
        res.end(listResponse);
      };
    });
  },

  notFound: (req, res) => {
    res.writeHead(404, {
      "Content-type": "text/html"
    });
    res.end("<h1>Sorry, this page doesn't exist</h1>");
  }
}

module.exports = handlers;
