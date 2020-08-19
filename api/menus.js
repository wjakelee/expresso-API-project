const express = require('express');             //import express
const menusRouter = express.Router();           //create menus router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');






module.exports = menusRouter;