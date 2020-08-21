const express = require('express');                               //import express
const menuItemsRouter = express.Router({mergeParams: true});      //create menu items router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//GET route retrieves all current menu items
menuItemsRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM MenuItem WHERE menu_id = $menuId`,
    { $menuId: req.params.menuId },
    (error, items) => {
      if (error){
        next(error);
      }
      res.status(200).json({ menuItems: items });
    }
  )
})


module.exports = menuItemsRouter;       //export menu items router