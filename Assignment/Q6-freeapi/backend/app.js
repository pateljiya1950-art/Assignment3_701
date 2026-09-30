require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

const auth = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());


// ================================
// MongoDB Connection
// ================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ================================
// Home
// ================================

app.get("/", (req, res) => {
    res.json({
        message: "Employee API is running"
    });
});


// ==================================================
// LOGIN
// ==================================================

app.post("/api/auth/login", async (req, res) => {

    try {

        const { empid, password } = req.body;

        if (!empid || !password) {
            return res.status(400).json({
                message: "Employee ID and password are required"
            });
        }

        const employee = await Employee.findOne({
            empid: empid.trim()
        });

        if (!employee) {
            return res.status(401).json({
                message: "Invalid employee ID or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            employee.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid employee ID or password"
            });
        }

        const token = jwt.sign(
            {
                employeeId: employee._id.toString(),
                empid: employee.empid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        res.json({
            message: "Login successful",

            token,

            employee: {
                id: employee._id,
                empid: employee.empid,
                name: employee.name,
                email: employee.email,
                department: employee.department,
                designation: employee.designation
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});


// ==================================================
// EMPLOYEE PROFILE
// ==================================================

app.get("/api/employee/profile", auth, async (req, res) => {

    try {

        const employee = await Employee
            .findById(req.employeeId)
            .select("-password");

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(employee);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch profile"
        });
    }
});


// ==================================================
// ADD LEAVE
// ==================================================

app.post("/api/leaves", auth, async (req, res) => {

    try {

        const {
            date,
            reason,
            grant
        } = req.body;

        if (!date || !reason || !grant) {
            return res.status(400).json({
                message: "Date, reason and grant are required"
            });
        }

        if (!["Yes", "No"].includes(grant)) {
            return res.status(400).json({
                message: "Grant must be Yes or No"
            });
        }

        const leave = await Leave.create({
            employee: req.employeeId,
            date,
            reason,
            grant
        });

        res.status(201).json({
            message: "Leave application added successfully",
            leave
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add leave"
        });
    }
});


// ==================================================
// LIST LEAVES
// ==================================================

app.get("/api/leaves", auth, async (req, res) => {

    try {

        const leaves = await Leave
            .find({
                employee: req.employeeId
            })
            .sort({
                date: -1
            });

        res.json(leaves);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch leaves"
        });
    }
});


// ==================================================
// Q6 - CURRENCY CONVERTER
// Backend calls free external API
// ==================================================

app.get("/api/currency/convert", auth, async (req, res) => {

    try {

        const {
            amount,
            from,
            to
        } = req.query;

        // Validate amount
        const numericAmount = Number(amount);

        if (
            !amount ||
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                message: "Enter a valid amount"
            });
        }

        if (!from || !to) {
            return res.status(400).json({
                message: "From and To currencies are required"
            });
        }

        // Same currency
        if (from.toUpperCase() === to.toUpperCase()) {

            return res.json({
                amount: numericAmount,
                from: from.toUpperCase(),
                to: to.toUpperCase(),
                rate: 1,
                result: numericAmount
            });
        }

        // Free Frankfurter API
        const apiUrl =
            `https://api.frankfurter.app/latest?amount=${numericAmount}&from=${from.toUpperCase()}&to=${to.toUpperCase()}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {

            return res.status(400).json({
                message: "Currency conversion API failed"
            });
        }

        const data = await response.json();

        const result = data.rates[to.toUpperCase()];

        if (result === undefined) {

            return res.status(400).json({
                message: "Currency not supported"
            });
        }

        const rate = result / numericAmount;

        res.json({
            amount: numericAmount,
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            rate: rate,
            result: result,
            date: data.date
        });

    } catch (error) {

        console.error("Currency API Error:", error);

        res.status(500).json({
            message: "Unable to convert currency"
        });
    }
});


// ==================================================
// SERVER
// ==================================================

app.listen(PORT, () => {

    console.log(
        `Employee backend running at http://localhost:${PORT}`
    );

});