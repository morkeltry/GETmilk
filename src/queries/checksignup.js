const dbConnection = require('../database/db_connections');

// function to check if a new username already exists in the database
const checksignup = (username, cb) => {
  const sqlQuery = `SELECT username FROM users WHERE username='${username}';`
  dbConnection.query(sqlQuery, (err, dbRes) => {
    if (err) {
      cb(err);
    } else {
      cb(null, dbRes)
    }
  })
}


module.exports = checksignup;
