const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        empid: {
            type: String,
            required: true,
            unique: true
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
            required: true
        },

        basicSalary: {
            type: Number,
            required: true
        },

        hra: {
            type: Number,
            required: true
        },

        da: {
            type: Number,
            required: true
        },

        grossSalary: {
            type: Number,
            required: true
        },

        pf: {
            type: Number,
            required: true
        },

        tax: {
            type: Number,
            required: true
        },

        netSalary: {
            type: Number,
            required: true
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

module.exports = mongoose.model("Employee", employeeSchema);