const express = require('express');
const Sequelize = require('sequelize');
const Joi = require('joi');
const { employee, department } = require('../models');

exports.getStatistics = async (req, res) => {
    try {
        // i. Department wise highest salary of employees.
        const departmentWiseHighestSalary = await employee.findAll({
            attributes: [
                'department_id',
                [Sequelize.fn('MAX', Sequelize.col('salary')), 'highest_salary'],
            ],
            group: ['department_id'],
        });

        // ii. Salary range wise employee count.
        const salaryRangeWiseEmployeeCount = await employee.findAll({
            attributes: [
                [Sequelize.literal('CASE WHEN salary <= 50000 THEN \'0-50000\' WHEN salary <= 100000 THEN \'50001-100000\' ELSE \'100000+\' END'), 'salary_range'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'employee_count'],
            ],
            group: ['salary_range'],
        });


        // iii. Name and age of the youngest employee of each department.
        const youngest_Employees = await employee.findAll({
            attributes: [
                'department_id',
                [Sequelize.fn('MIN', Sequelize.fn('COALESCE', Sequelize.col('dob'), 'default_date')), 'youngest_dob'],
            ],
            group: ['department_id'],
            include: [
                {
                    model: department,
                    attributes: [],
                },
            ],
        });

        const result = {
            departmentWiseHighestSalary,
            salaryRangeWiseEmployeeCount,
            youngest_Employees,
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
