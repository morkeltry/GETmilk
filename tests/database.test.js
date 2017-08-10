const fs = require('fs');
const dbConnection = require('./test_database/db_connections_test');
const dbBuild = require('./test_database/db_build_test');
const tape = require('tape');
const addtolist = require('../src/queries/addtolist');
const adduser = require('../src/queries/adduser');
const checklogin = require('../src/queries/checklogin');
const getlist = require('../src/queries/getlist');

// const hash = require ('crypto').hmac or somesuch
const hash = (input) => {return input};

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
  getData( (err, res) => {
    if (err) console.log(err);
    t.deepEquals(res, expected, 'getlist should tell us we need milk, flowers and cookies.');
    t.end();
  });
});

tape('check if addtolist adds a new entry to database', (t) => {
  resetDatabase();
  addtolist(3,'Chicken',0, (err, res) => {
    if (err) console.log(err);
    dbConnection.query('SELECT * FROM list;', (err, res) => {
      if (err);
      const expected = {
        id: 4,
        owner_id: 3,
        content : 'Chicken',
        marked_by: 0
      };
        const actual = res.rows[3];
        t.deepEquals(expected, actual, 'both rows should have same values');
        dbConnection.end();
        t.end();
    });
  });
});

//
// tape ('check that checklogin does not return password / password hash', (t) =>{
//
// }

tape ('check that checklogin with a valid user and password returns a single result with id,  username and admin status given', (t) => {
  resetDatabase();
  const expected = {
    id:
    username:'Tom'
    is_admin: false
  };

  checklogin ('Tom', hash(12345), (err,result) => {
    if (err) console.log(err);
    t.deepEquals( result, expected, 'checklogin should return {id, username, is_admin} ');
    t.end();


  });
});
//
// tape ('check that checklogin with a valid user and invalid password returns error callback', (t) => {
//   checklogin ('Tom', hash(12345), (err,result) => {
//   if (err) console.log(err);
//     t.deepEquals( result, expected, 'checklogin should return {id, username, is_admin} ');
//     t.end();
//
//
//   });
// );
//


// tape ('check that checklogin with non-existence user returns error callback' (t) => {
//
// );
//
//
//
//
// tape('check if adduser adds a new entry to database',
//
// tape('check if adduser returns maximum one entry if multiple users found',
//
// tape('check if adduser throws error if user exists',
//
// tape('check if adduser throws error if user is blank',
