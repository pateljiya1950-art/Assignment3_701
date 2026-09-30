require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Employee =
    require("./models/Employee");

const Leave =
    require("./models/Leave");

const authenticateEmployee =
    require("./middleware/auth");


const app = express();

const PORT =
    process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error
        );

    });


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "ERP Employee API is running"
    });
});


// ==========================================
// EMPLOYEE LOGIN
// ==========================================

app.post(
    "/api/auth/login",
    async (req, res) => {

        try {

            const {
                empid,
                password
            } = req.body;


            // Validation

            if (
                !empid ||
                !password
            ) {

                return res.status(400).json({
                    message:
                        "Employee ID and password are required."
                });
            }


            // Find employee

            const employee =
                await Employee.findOne({
                    empid:
                        empid.trim().toUpperCase()
                });


            if (!employee) {

                return res.status(401).json({
                    message:
                        "Invalid Employee ID or password."
                });
            }


            // Compare password

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    employee.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    message:
                        "Invalid Employee ID or password."
                });
            }


            // Generate JWT

            const token =
                jwt.sign(
                    {
                        employeeId:
                            employee._id.toString(),

                        empid:
                            employee.empid
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            process.env.JWT_EXPIRE ||
                            "1h"
                    }
                );


            return res.json({

                message:
                    "Login successful",

                token,

                employee: {

                    id:
                        employee._id,

                    empid:
                        employee.empid,

                    name:
                        employee.name,

                    email:
                        employee.email,

                    department:
                        employee.department,

                    designation:
                        employee.designation
                }

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Server error."
            });
        }
    }
);


// ==========================================
// EMPLOYEE PROFILE
// ==========================================

app.get(
    "/api/employee/profile",
    authenticateEmployee,
    async (req, res) => {

        try {

            const employee =
                await Employee.findById(
                    req.employeeId
                ).select(
                    "-password"
                );


            if (!employee) {

                return res.status(404).json({
                    message:
                        "Employee not found."
                });
            }


            return res.json({
                employee
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Unable to fetch profile."
            });
        }
    }
);


// ==========================================
// ADD LEAVE
// ==========================================

app.post(
    "/api/leaves",
    authenticateEmployee,
    async (req, res) => {

        try {

            const {
                date,
                reason,
                grant
            } = req.body;


            if (
                !date ||
                !reason ||
                !grant
            ) {

                return res.status(400).json({
                    message:
                        "Date, reason and grant are required."
                });
            }


            if (
                grant !== "Yes" &&
                grant !== "No"
            ) {

                return res.status(400).json({
                    message:
                        "Grant must be Yes or No."
                });
            }


            const leave =
                new Leave({

                    employee:
                        req.employeeId,

                    date,

                    reason,

                    grant
                });


            await leave.save();


            return res.status(201).json({

                message:
                    "Leave application added successfully.",

                leave

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Unable to add leave application."
            });
        }
    }
);


// ==========================================
// LIST LEAVES
// ==========================================

app.get(
    "/api/leaves",
    authenticateEmployee,
    async (req, res) => {

        try {

            const leaves =
                await Leave
                    .find({
                        employee:
                            req.employeeId
                    })
                    .sort({
                        date: -1
                    });


            return res.json({
                leaves
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Unable to fetch leave applications."
            });
        }
    }
);


// ==========================================
// DELETE LEAVE
// ==========================================

app.delete(
    "/api/leaves/:id",
    authenticateEmployee,
    async (req, res) => {

        try {

            const leave =
                await Leave.findOneAndDelete({

                    _id:
                        req.params.id,

                    employee:
                        req.employeeId
                });


            if (!leave) {

                return res.status(404).json({
                    message:
                        "Leave application not found."
                });
            }


            return res.json({
                message:
                    "Leave application deleted successfully."
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Unable to delete leave."
            });
        }
    }
);


// ==========================================
// LOGOUT
// ==========================================

app.post(
    "/api/auth/logout",
    authenticateEmployee,
    (req, res) => {

        /*
         JWT is stateless.

         Logout is completed on the frontend
         by removing the JWT from localStorage.
        */

        return res.json({
            message:
                "Logout successful."
        });
    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Employee API running at http://localhost:${PORT}`
        );
    }
);