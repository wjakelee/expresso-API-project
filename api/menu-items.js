const express = require('express');                               //import express
const menuItemsRouter = express.Router({mergeParams: true});      //create menu items router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


/*for any route that has an /:menuItemId parameter, this handler will be executed first
to make sure the menuItemId exists in the database*/
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get(`SELECT * FROM MenuItem WHERE id = $menuItemId`, { $menuItemId: menuItemId },
    (error, menuItem) => {
      if (error){
        next(error);
      } else if (menuItem) {
        req.menuItem = menuItem;            //attach found menuItem to req object
        next();
      } else {
        res.sendStatus(404);                //menuItem id does not exist in table
      }
    });
});


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


//POST route creates a new menuItem related to menu id
menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;
  if (!name || !inventory || !price){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //insert new menuItem into MenuItem table
  db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id)
  VALUES ($name, $description, $inventory, $price, $menuId)`,
    {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuId: req.params.menuId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`,      //retrieve last added menuItem
          (error, menuItem) => {
            if (error){
              next(error);
            }
            res.status(201).json({ menuItem: menuItem });     //send last added menuItem
          })
      }
    }
  );
});


//PUT route updates menuItem related to menuItem id
menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;
  const menuItemId = req.params.menuItemId;
  if (!name || !inventory || !price){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //update menuItem in MenuItem table
  db.run(`UPDATE MenuItem SET name = $name, description = $description,
  inventory = $inventory, price = $price WHERE id = $menuItemId`,
    {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuItemId: menuItemId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`,      //retrieve updated menuItem
          (error, menuItem) => {
            if (error){
              next(error);
            }
            res.status(200).json({ menuItem: menuItem });     //send updated menuItem
          })
      }
    }
  );
});


//DELETE route deletes menuItem with provided Id
menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  db.run(`DELETE FROM MenuItem WHERE id = $menuItemId`, { $menuItemId: req.params.menuItemId },
    function(error){
      if (error){
        next(error);
      } else {
        res.sendStatus(204);
      }
    }
  );
})



module.exports = menuItemsRouter;       //export menu items router