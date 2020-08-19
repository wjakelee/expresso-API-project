const express = require('express');             //import express
const timesheetsRouter = express.Router({mergeParams: true});       //create timesheets router and merge params with employees router

const sqlite3 = require('sqlite3');             //import database
const employeesRouter = require('./employees');
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

//POST route creates a new timesheet related to employee id
timesheetsRouter.post('/', (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  if (!hours || !rate || !date){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //insert new timesheet into Timesheet table
  db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id)
  VALUES ($hours, $rate, $date, $employeeId)`,
    {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employeeId: req.params.employeeId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`,      //retrieve last added timsheet
          (error, timesheet) => {
            if (error){
              next(error);
            }
            res.status(201).json({ timesheet: timesheet });     //send last added timesheet
          })
      }
    }
  );
});

module.exports = timesheetsRouter;