const express = require('express');                 //import express
const apiRouter = express.Router();                 //create api router

const employeesRouter = require('./employees');     //import employees router

apiRouter.use('/employees', employeesRouter);            //any endpoint with /employees will use employees router


module.exports = apiRouter;               //export api router