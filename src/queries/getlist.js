const dbConnection = require('../database/db_connections');

const getlist = (cb) => {
  const sqlQuery = 'SELECT content FROM list;';
  dbConnection.query(sqlQuery, (err, dbRes) => {
    if (err) {
      cb(err)
    } else {
      cb(null, dbRes.rows);
    }
  });
};

module.exports = getlist;
