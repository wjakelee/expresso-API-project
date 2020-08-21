const express = require('express');             //import express
const menusRouter = express.Router();           //create menus router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menu-items');   //import menu items router


/*for any route that has an /:menuId parameter, this handler will be executed first
to make sure the menuId exists in the database*/
menusRouter.param('menuId', (req, res, next, menuId) => {
  db.get(`SELECT * FROM Menu WHERE id = $menuId`, { $menuId: menuId },
    (error, menu) => {
      if (error){
        next(error);
      } else if (menu) {
        req.menu = menu;            //attach found menu to req object
        next();
      } else {
        res.sendStatus(404);                //menu id does not exist in table
      }
    });
});


//directs route to menu items router
menusRouter.use('/:menuId/menu-items', menuItemsRouter);


//GET route retrieves all current menus
menusRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Menu`, (error, menus) => {
    if (error){
      next(error);
    }
    res.status(200).json({ menus: menus });
  })
})


//GET route retrieves requested menu by menuId
menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({ menu: req.menu });
});


//POST route adds a menu to the Menu table if all require parameters exist
menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //insert new menu into Menu table
  db.run(`INSERT INTO Menu (title) VALUES ($title)`,
    { $title: title },
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


//PUT router updates menu with specific menu Id
menusRouter.put('/:menuId', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //update menu into menu table
  db.run(`UPDATE Menu SET title = $title WHERE id = $menuId`,
    {
      $title: title,
      $menuId: req.params.menuId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, //retrieve last updated menu
          (error, menu) => {
            if (error){
              next(error);
            }
            res.status(200).json({ menu: menu });       //send last updated menu
          })
      }
    }
  );
});

//NEED TO FIX THIS, IT RELATES TO MENU ITEMS
// //DELETE route deletes requested menu
// menusRouter.delete('/:menuId', (req, res, next) => {
//   db.run(`DELETE FROM Menu WHERE id = $menuId`, { $menuId: req.params.menuId },
//     function(error){
//       if (error){
//         next(error);
//       } else {
//             res.sendStatus(204);
//       }
//     }
//   );
// })



module.exports = menusRouter;