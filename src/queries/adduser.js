const dbConnection = require('../database/db_connections');

const adduser = (username, hashedPassword, cb) => {
  const sqlQuery = `INSERT INTO users (username, hashedPassword) VALUES ($1, $2)`;
  dbConnection.query(sqlQuery, [username, hashedPassword], (err,res) => {
    if (err) {
      cb(err)
    } else {
      cb(null,res.rows);
    }
  });
};

module.exports = adduser;
