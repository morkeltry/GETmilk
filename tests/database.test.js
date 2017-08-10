const fs = require('fs');
const dbConnection = require('./test_database/db_connection.test');
const dbBuild = require('./test_database/db_build.test');
const tape = require('tape');
const addtolist = require('../src/queries/addtolist');
const adduser = require('../src/queries/adduser');
const checkuser = require('../src/queries/checkuser');
const getlist = require('../src/queries/getlist');

const sql = fs.readFileSync(`${__dirname}/database-test/db_build.test.sql`).toString();

const resetDatabase = () => {
  dbConnection.query(sql, (err) => {
    if (err) throw err;
  });
};

tape('initialising tape', (t) => {
  t.equals(1, 1, '1 should equal 1 :)');
  t.end();
});

tape('Testing getlist.js', (t) => {
  resetDatabase();
  const expected = [{
    owner_id: 1,
    content: 'get milk',
    marked_by: 2,
  },
  {
    owner_id: 2,
    content: 'buy flowers',
    marked_by: 2,
  },
  {
    owner_id: 1,
    content: 'cookies',
    marked_by: NULL,
  },
  ];
  getData(dbConnection, (err, res) => {
    if (err) console.log(err);
    t.deepEquals(res, expected, 'getlist should give us all of our shopping.');
    t.end();
  });
});

tape('check if postData adds a new entry to database', (t) => {
  resetDatabase();
  postData('Mulino Bianco', 'Abbracci', 500, true, dbConnection, (err, res) => {
    if (err) console.log(err);
    dbConnection.query('SELECT * FROM biscuits;', (err, res) => {
      if (err);
      const expected = {
        id: 4,
        name: 'Abbracci',
        brand: 'Mulino Bianco',
        chocolate: true,
        calories: 500 };
        const actual = res.rows[3];
        t.deepEquals(expected, actual, 'both rows should have same values');
        dbConnection.end();
        t.end();
    });
  });
});
