const dbConnection = require('../database/db_connections');

const addtolist = (content, cb) => {
  const sqlQuery = `INSERT INTO list (content) VALUES ($1)`;
  dbConnection.query(sqlQuery, [content], (err,res) => {
    if (err) {
      cb(err)
    } else {
      cb(null,res.rows);
    }
  });
};

module.exports = addtolist;
