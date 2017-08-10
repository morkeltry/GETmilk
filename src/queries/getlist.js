const dbConnection = require('../database/db_connections');

const getlist = (cb) => {
  const sqlQuery = 'SELECT content FROM list;';
  dbConnection.query(sqlQuery, (err, dbRes) => {
    console.log("Hellooo")
    if (err) {
      console.log("I am ERROR ", err)
      cb(err)
    } else {
      console.log("I'm on my way")
      cb(null, dbRes.rows);
    }
  });
};

module.exports = getlist;
