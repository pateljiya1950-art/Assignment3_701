const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        empid: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        department: {
            type: String,
            required: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        basicSalary: {
            type: Number,
            required: true,
            min: 0
        },

        hra: {
            type: Number,
            required: true,
            min: 0
        },

        da: {
            type: Number,
            required: true,
            min: 0
        },

        grossSalary: {
            type: Number,
            required: true,
            min: 0
        },

        pf: {
            type: Number,
            required: true,
            min: 0
        },

        tax: {
            type: Number,
            required: true,
            min: 0
        },

        netSalary: {
            type: Number,
            required: true,
            min: 0
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Employee",
    employeeSchema
);