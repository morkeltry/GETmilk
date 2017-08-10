
function checkLogin (strippedJwt, successCallback) {
/// performs query to validate strippedJwt contents,
// passes (err, user) back to cb, where user = display name of user who is OK to log in.
/// this is where we would pass back {id,user} if id required in frontend



// const strippedJwt = {jwtContents.username, jwtContents.hashPassword,  jwtContents.perUserSalt}


  const sqlQuery = `SELECT hashedPassword FROM users WHERE username=$1;`
  dbConnection.query(sqlQuery, [strippedJwt.username], (err, correctHPw) => {
    if (err) {
      cb (err);
    } else {
      bcryptcompare (strippedJwt.cleartextPassword, correctHPw, (err,ok)=> {
        if (err) {
          cb (err);
        }
        else {
          if (ok) {
            cb (null, username);
          }
          else {
            cb (new RangeError ('wrong password - '+strippedJwt.cleartextPassword+' did not match'));
          }

        }
      });
    }
  });

}

module.exports = checkLogin;
