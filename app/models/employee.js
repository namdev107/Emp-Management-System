'use strict';

module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define('employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE,
        },
        phone: {
            type: DataTypes.STRING(15),
        },
        photo: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        salary: {
            type: DataTypes.DECIMAL(10, 2),
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'Active',
        },
        created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        modified: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    }, {
        timestamps: false,
        tableName: 'employee',
        freezTable: true
    });


    return employee;
};