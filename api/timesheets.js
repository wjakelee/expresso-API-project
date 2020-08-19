const express = require('express');             //import express
const timesheetsRouter = express.Router({mergeParams: true});       //create timesheets router and merge params with employees router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//GET route retrieves all saved timesheets related to employee Id
timesheetsRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Timesheet WHERE employee_id = $employeeId`,
    { $employeeId: req.params.employeeId },
    (error, timesheets) => {
      if (error){
        next(error);
      }
      res.status(200).json({ timesheets: timesheets});      //send all timesheets relating to employeeId
    });
});


module.exports = timesheetsRouter;