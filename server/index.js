const http = require('http');
const PORT = process.env.PORT || 5000;
const { matchRoute } = require('./helpers');
const mongoose = require('mongoose');
const routes = require('./routes');
const { generateResponse } = require('./helpers');
mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0.c4xra.mongodb.net/PuAc?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then((_) => console.log('Connected to DB!'))
  .catch((err) => console.log(err));

http
  .createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'application/json'); // Set Content Type to return JSON

    return await matchRoute(req, res, routes);
  })
  .listen(PORT);
