const express = require('express');             //import express
const timesheetsRouter = express.Router({mergeParams: true});       //create timesheets router and merge params with employees router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');





module.exports = timesheetsRouter;