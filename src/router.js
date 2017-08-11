const handlers = require('./handlers');
const url = require('url');

const router = (req, res, otherArg) => {
  const routes = {
    '/': handlers.home,
    '/main.css': handlers.assets,
    '/index.js': handlers.assets,
    '/login': handlers.login,
    '/loggedin': handlers.loggedin,
    '/loginerror': handlers.loginerror,
    '/signup': handlers.signup,
    '/checkuser': handlers.checkuser,
    '/adduser': handlers.adduser,
    '/addtolist': handlers.addtolist,
    '/getlist': handlers.getlist,
  };

  const endpoint = url.parse(req.url).pathname;
  if (routes[endpoint]) {
    routes[endpoint](req, res, otherArg);
  } else {
    handlers.notFound(req, res);
  }
};

module.exports = router;
