const express = require('express');             //import express
const employeesRouter = express.Router();       //create employees router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');





module.exports = employeesRouter;     //export employees router