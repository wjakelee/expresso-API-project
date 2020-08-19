const express = require('express');             //import express
const menusRouter = express.Router();           //create menus router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//GET route retrieves all current menus
menusRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Menu`, (error, menus) => {
    if (error){
      next(error);
    }
    res.status(200).json({ menus: menus });
  })
})


//POST route adds a menu to the Menu table if all require parameters exist
menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //insert new menu into Menu table
  db.run(`INSERT INTO Menu (title) VALUES ($title)`,
    {
      $title: title,
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`,      //retrieve last added menu
          (error, menu) => {
            if (error){
              next(error);
            }
            res.status(201).json({ menu: menu });     //send last added menu
          })
      }
    }
  );
});


module.exports = menusRouter;