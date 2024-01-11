const express = require('express');
const Joi = require('joi');
const department = require('../models').department;
const moment = require('moment');


exports.createNewDepartment = async (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({

        department_id: Joi.number().positive().integer().required(),
        name: Joi.string().required(),
        status: Joi.string().trim(),        
    });

    try {
        await schema.validateAsync(data);

        // Check if an department Name with the same department Name already exists

        let where = {};
        if (data.department_id) {
            where.id = req.body.department_id;
        }

        const existingDepartment = await department.findOne({
            where: where
        });

        if (existingDepartment) {
            return res.send({
                errorCode: -1,
                status: false,
                returnMessage: `Department Id with the same Department Id already exists`,
                data: existingDepartment
            });
        }

        const result = await department.create({
            name: req.body.name,
            department_id: req.body.department_id,
            created: moment(new Date()),
            status: req.body.status
        });

        res.send({
            errorCode: 0,
            status: true,
            data: result,
            successMessage: `Department Details Added Successfully!`
        });
    } catch (error) {
        res.status(400).json({
            errorCode: 400,
            status: false,
            returnMessage: error.message || "Invalid data provided."
        });
    }
};