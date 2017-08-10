const dbConnection = require('../database/db_connections');

// function to check if a new username already exists in the database
const checkNewUsername = (username, cb) => {
  const sqlQuery = `SELECT * FROM users WHERE username=${username};`
  dbConnection.query(sqlQuery, (err, res) => {
    if (err) {
      cb(err);
    }
    else {
      cb
    }
  }
}

// function to validate a username and password on the log in page
// const checkuser = (username, hashedPassword, cb) => {
//   const sqlQuery = `INSERT INTO users (username, hashedPassword) VALUES ($1, $2)`;
//   dbConnection.query(sqlQuery, [username, hashedPassword], (err, res) => {
//     if (err) {
//       cb(err)
//     } else {
//       cb(null,res.rows);
//     }
//   });
// };

module.exports = {
  checkuser,
  checkNewUsername
}
