const express = require('express');
const Joi = require('joi');
const employee = require('../models').employee;
const moment = require('moment');

exports.getAllEmployees = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;

        const offset = (page - 1) * pageSize;

        const result = await employee.findAll({
            limit: pageSize,
            offset: offset
        });

        if (result.length > 0) {
            res.send({
                "statusCode": 200,
                "status": true,
                "successMessage": "Data Found.",
                "data": result
            });
        } else {
            res.send({
                "status": false,
                "returnMessage": "Data Not Found",
                "data": []
            });
        }

    } catch (err) {
        console.log("Error fetching employeedetails :", err);
        res.status(500).json({ error: "something went wrong" })
    }
}


exports.createNewEmployee = async (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({

        name: Joi.string().required(),
        department_id: Joi.number().positive().integer().required(),
        dob: Joi.date().iso(),
        phone: Joi.string().trim(),
        photo: Joi.string().trim(),
        email: Joi.string().required().email(),
        salary: Joi.number().positive(),
        status: Joi.string().trim(),
    });

    try {
        await schema.validateAsync(data);

        // Check if an employee with the same email already exists
        const existingEmployee = await employee.findOne({
            where: {
                email: req.body.email
            }
        });

        if (existingEmployee) {
            return res.send({
                errorCode: -1,
                status: false,
                returnMessage: `Employee with the same email already exists`,
                data: existingEmployee
            });
        }

        const result = await employee.create({
            name: req.body.name,
            department_id: req.body.department_id,
            dob: req.body.dob,
            phone: req.body.phone,
            photo: req.body.photo,
            email: req.body.email,
            salary: req.body.salary,
            created: moment(new Date()),
            status: req.body.status
        });

        res.send({
            errorCode: 0,
            status: true,
            data: result,
            successMessage: `Employee Details Added Successfully!`
        });
    } catch (error) {
        res.status(400).json({
            errorCode: 400,
            status: false,
            returnMessage: error.message || "Invalid data provided."
        });
    }
};


exports.updateAddEmployee = async (req, res) => {
    const data = req.body;

    const schema = Joi.object().keys({
        name: Joi.string().required(),
        department_id: Joi.number().positive().integer().required(),
        dob: Joi.date().iso(),
        phone: Joi.string().required().trim(),
        photo: Joi.string().trim(),
        email: Joi.string().required().email(),
        salary: Joi.number().positive().required(),
        status: Joi.string().required(),
    });

    try {
        await schema.validateAsync(data);

        const existingEmployee = await employee.findOne({
            where: {
                email: data.email
            }
        });

        if (existingEmployee) {
            const updateInput = {
                name: req.body.name,
                department_id: req.body.department_id,
                phone: req.body.phone,
                photo: req.body.photo,
                salary: req.body.salary,
                modified: moment(new Date()),
                status: req.body.status
            };

            const result = await employee.update(updateInput, {
                where: {
                    email: data.email
                }
            });

            if (result) {
                res.send({
                    errorCode: 0,
                    data: result,
                    message: "Employee Details Updated."
                });
            } else {
                res.send({
                    errorCode: -1,
                    data: [],
                    message: "Employee Details Not Updated."
                });
            }
        } else {
            const createInput = {
                name: req.body.name,
                department_id: req.body.department_id,
                phone: req.body.phone,
                photo: req.body.photo,
                salary: req.body.salary,
                created: moment(new Date()),
                status: req.body.status
            };

            const result = await employee.create(createInput);

            if (result) {
                res.send({
                    errorCode: 0,
                    data: result,
                    message: "New Employee created Successfully."
                });
            } else {
                res.send({
                    errorCode: -1,
                    data: [],
                    message: "New Employee Not Created."
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            errorCode: 400,
            message: error.details[0].message
        });
    }
};

exports.deleteEmpData = async (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().required().email(),
    });

    try {
        const { email } = req.body;
        await schema.validateAsync({ email });

        let where = {};
        if (email) {
            where = { email };
        }

        const existingEmployee = await employee.findOne({
            where: where
        });

        if (existingEmployee) {
            const deletedCount = await employee.destroy({
                where: where
            });

            if (deletedCount > 0) {
                res.send({
                    status: true,
                    returnMessage: "Record deleted successfully.",
                    data: []
                });
            } else {
                return res.status(404).json({ message: 'Record not found for deletion.' });
            }
        } else {
            res.send({
                status: false,
                returnMessage: "Data Not Found",
                data: []
            });
        }
    } catch (err) {
        res.status(400).json({ error: err.details ? err.details[0].message : "Invalid data provided" });
    }
};
