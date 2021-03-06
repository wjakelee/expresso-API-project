const express = require('express');             //import express
const employeesRouter = express.Router();       //create employees router

const sqlite3 = require('sqlite3');             //import database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const timesheetsRouter = require('./timesheets');   //import timesheets router


/*for any route that has an /:employeeId parameter, this handler will be executed first
to make sure the employeeId exists in the database*/
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  db.get(`SELECT * FROM Employee WHERE id = $employeeId`, { $employeeId: employeeId },
    (error, employee) => {
      if (error){
        next(error);
      } else if (employee) {
        req.employee = employee;            //attach found employee to req object
        next();
      } else {
        res.sendStatus(404);                //employee id does not exist in table
      }
    });
});


//directs route to timesheets router
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter); 


//GET route retrieves all current employees
employeesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Employee WHERE is_current_employee = 1`,
    (error, employees) => {
      if (error){
        next(error);
      }
      res.status(200).json({ employees: employees });     //send all employees as json
    });
});


//GET route retrievs request employee by employeeId
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({ employee: req.employee });
});


//POST route adds an employee to the Employee table is all require parameters exist
employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name;
  const postion = req.body.employee.position;
  const wage = req.body.employee.wage;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !postion || !wage){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //insert new employee into Employee table
  db.run(`INSERT INTO Employee (name, position, wage, is_current_employee)
    VALUES ($name, $position, $wage, $isCurrentEmployee)`,
    {
      $name: name,
      $position: postion,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`,      //retrieve last added employee
          (error, employee) => {
            if (error){
              next(error);
            }
            res.status(201).json({ employee: employee });     //send last added employee
          })
      }
    }
  );
});


//PUT router updates employee with specific employee Id
employeesRouter.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name;
  const postion = req.body.employee.position;
  const wage = req.body.employee.wage;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !postion || !wage){
    res.sendStatus(400);                     //request has incorrect parameters
  }

  //update employee into Employee table
  db.run(`UPDATE Employee SET name = $name, position = $position,
    wage = $wage, is_current_employee = $isCurrentEmployee WHERE id = $employeeId`,
    {
      $name: name,
      $position: postion,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee,
      $employeeId: req.params.employeeId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, //retrieve last updated employee
          (error, employee) => {
            if (error){
              next(error);
            }
            res.status(200).json({ employee: employee });       //send last updated employee
          })
      }
    }
  );
});


//DELETE route changes status of current employee to 0
employeesRouter.delete('/:employeeId', (req, res, next) => {
  db.run(`UPDATE Employee SET is_current_employee = $isCurrentEmployee WHERE id = $employeeId`,
    {
      $isCurrentEmployee: 0,
      $employeeId: req.params.employeeId
    },
    function(error){
      if (error){
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`,  //retrieve last deleted employee
          (error, employee) => {
            if (error){
              next(error);
            }
            res.status(200).json({ employee: employee });       //send last deleted employee
          })
      }
    }
  );
})

module.exports = employeesRouter;     //export employees router