const express = require('express');                 //import express
const apiRouter = express.Router();                 //create api router

const employeesRouter = require('./employees');     //import employees router
const menusRouter = require('./menus');             //import menus router

apiRouter.use('/employees', employeesRouter);       //any endpoint with /employees will use employees router
apiRouter.use('/menus', menusRouter);               //any endpoint with /menus will use menus router

module.exports = apiRouter;               //export api router