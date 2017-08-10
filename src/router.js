const handlers = require('./handlers');
const url = require('url');

const router = (req, res) => {
  const routes = {
    '/': handlers.home,
    '/main.css': handlers.assets,
    '/index.js': handlers.assets,
    '/loggedin': handlers.loggedin,
    '/signup': handlers.signup,
    '/checkuser': handlers.checkuser,
    '/adduser': handlers.adduser,
    '/addtolist': handlers.addtolist,
  };

  const endpoint = url.parse(req.url).pathname;
  if (routes[endpoint]) {
    routes[endpoint](req, res);
  } else {
    handlers.notFound(req, res);
  }
};

module.exports = router;
