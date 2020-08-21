const express = require('express');                 //import express
const menuItemsRouter = express.Router();           //create menu items router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');





module.exports = menuItemsRouter;       //export menu items router