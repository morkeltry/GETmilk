const http = require('http');
const router = require('./router');


const server = http.createServer(router);
const port = process.env.PORT || 3000;

const startServer = () => {
  server.listen(port, () => {
    console.log(`Here be dragons... ${port}`);
  });
};

startServer();
