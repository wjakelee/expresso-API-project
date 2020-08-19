const express = require('express');               //import express
const bodyParser = require('body-parser');        //body parser module
const errorhandler = require('errorhandler');     //errorhandle module
const cors = require('cors');                     //cross orgin resource sharing
const morgan = require('morgan');                 //morgan logger module

const apiRouter = require('./api/api');           //import api router from api directory

const app = express();                      //create express app
const PORT = process.env.PORT || 4000;      //create port 4000 (where front-end will make requests)

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', apiRouter);             //all routes that have endpoint /api will be sent to apiRouter

app.use(errorhandler());

app.listen(PORT, () => {
  console.log(`Listing on PORT ${PORT}`);   //listen on PORT 4000
})

module.exports = app;         //export express app