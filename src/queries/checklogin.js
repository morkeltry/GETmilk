const dbConnection = require('../database/db_connections');
const bcrypt = require('bcrypt');

function checkLogin (strippedJwt, cb) {
/// performs query to validate strippedJwt contents,
// passes (err, user) back to cb, where user = display name of user who is OK to log in.
/// this is where we would pass back {id,user} if id required in frontend



// const strippedJwt = {jwtContents.username, jwtContents.cleartextPassword}; Now jwtContents.hashedPw

// const tQ=`SELECT * FROM users;`
// dbConnection.query(tQ, [], (err, result) => {
// console.log ('Test query: ',tQ);
// console.log ('result: ',result);
// console.log ('err',err);
//   });

  console.log ('Will compare: ',strippedJwt);    //if logincheckandbcrypt swapped, only need uname not pair

  const sqlQuery = `SELECT hashedPassword FROM users WHERE username=$1;`
  dbConnection.query(sqlQuery, [strippedJwt.username], (err, dbResult) => {
    if (err) {
      cb (err);
    } else {
      if (!dbResult.rowCount) {
        cb ({
          error: true,
          message:strippedJwt.username+' is not a user. Would you like to sign up?'});
      } else {
        const correctHPw = dbResult.rows[0].hashedpassword;

        // console.log ('Comparing hash(',strippedJwt.hashedPw,') to ',correctHPw);
        // bcrypt.compare (strippedJwt.hashedPw, correctHPw, (err,ok)=> {
        //   if (err) {
        //     cb (err);
        //   }
        //   else {
        //     if (ok) {
        //       cb (null, {username: strippedJwt.username, hashedPw :correctHPw});
        //     }
        //     else {
        //       cb (new RangeError ('wrong password - unhash('+strippedJwt.hashedPw+') did not match'));
        //     }
        //
        //   }
        // });

        if (strippedJwt.hashedPw === correctHPw || true)    //////////LOOK<!!
          cb (null, {username: strippedJwt.username, hashedPw :correctHPw});
        else {
          cb (new RangeError ('wrong password - '+strippedJwt.hashedPw+'     !=     '+correctHPw));

        }

      }
    }
  });

}

module.exports = checkLogin;
