'use strict';
const { Console, log } = require('console');
module.exports = function (app) {

  const employeedetails = require('../controllers/employee.controller');
  const departmentdetails = require('../controllers/department.controller');
  const statistic = require('../controllers/statistics.controller');

  // todoList Routes
  // app.get("/api", (req, res) => {
  //   res.status(200).send({
  //     message: "welcome to test"
  //   });
  // })

  app.get("/getAllEmployees", employeedetails.getAllEmployees);
  app.post("/createNewEmployee", employeedetails.createNewEmployee);
  app.put("/updateAddEmployee", employeedetails.updateAddEmployee);
  app.delete("/deleteEmpData", employeedetails.deleteEmpData);

  app.get('/getStatistics', statistic.getStatistics);

  app.post("/createNewDepartment", departmentdetails.createNewDepartment);


}