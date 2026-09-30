require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");

const Employee = require("./models/Employee");

const isAdmin =
    require("./middleware/auth");

const generateEmployeeId =
    require("./utils/employeeId");

const generatePassword =
    require("./utils/password");

const app = express();

const PORT =
    process.env.PORT || 3000;


// ==================================================
// EXPRESS CONFIGURATION
// ==================================================

app.set("view engine", "ejs");

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==================================================
// SESSION
// ==================================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge:
                1000 * 60 * 60
        }
    })
);


// ==================================================
// MONGODB CONNECTION
// ==================================================

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


// ==================================================
// EMAIL CONFIGURATION
// ==================================================

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASS
        }
    });


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {

    if (req.session.admin) {

        return res.redirect(
            "/dashboard"
        );
    }

    return res.redirect("/login");
});


// ==================================================
// ADMIN LOGIN - GET
// ==================================================

app.get("/login", (req, res) => {

    if (req.session.admin) {

        return res.redirect(
            "/dashboard"
        );
    }

    res.render("login", {
        error: null
    });
});


// ==================================================
// ADMIN LOGIN - POST
// ==================================================

app.post("/login", (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (
        username ===
        process.env.ADMIN_USERNAME &&

        password ===
        process.env.ADMIN_PASSWORD
    ) {

        req.session.admin = {
            username: username
        };

        return res.redirect(
            "/dashboard"
        );
    }


    return res.render("login", {

        error:
            "Invalid username or password."
    });
});


// ==================================================
// DASHBOARD
// ==================================================

app.get(
    "/dashboard",
    isAdmin,
    async (req, res) => {

        try {

            const employeeCount =
                await Employee.countDocuments();


            const employees =
                await Employee
                    .find()
                    .sort({
                        createdAt: -1
                    });


            res.render(
                "dashboard",
                {
                    admin:
                        req.session.admin,

                    employeeCount,

                    employees
                }
            );

        } catch (error) {

            console.error(error);

            res
                .status(500)
                .send(
                    "Server error"
                );
        }
    }
);


// ==================================================
// EMPLOYEE LIST
// ==================================================

app.get(
    "/employees",
    isAdmin,
    async (req, res) => {

        try {

            const employees =
                await Employee
                    .find()
                    .sort({
                        createdAt: -1
                    });


            res.render(
                "employees",
                {
                    employees,

                    message:
                        req.query.message ||
                        null,

                    error:
                        req.query.error ||
                        null
                }
            );

        } catch (error) {

            console.error(error);

            res
                .status(500)
                .send(
                    "Unable to fetch employees."
                );
        }
    }
);


// ==================================================
// ADD EMPLOYEE - GET
// ==================================================

app.get(
    "/employees/add",
    isAdmin,
    (req, res) => {

        res.render(
            "add-employee",
            {
                error: null
            }
        );
    }
);


// ==================================================
// ADD EMPLOYEE - POST
// ==================================================

app.post(
    "/employees/add",
    isAdmin,
    async (req, res) => {

        try {

            const {
                name,
                email,
                department,
                designation,
                basicSalary
            } = req.body;


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !department ||
                !designation ||
                !basicSalary
            ) {

                return res.render(
                    "add-employee",
                    {
                        error:
                            "All fields are required."
                    }
                );
            }


            const basic =
                Number(basicSalary);


            if (
                Number.isNaN(basic) ||
                basic <= 0
            ) {

                return res.render(
                    "add-employee",
                    {
                        error:
                            "Basic salary must be greater than 0."
                    }
                );
            }


            // ------------------------------------------
            // CHECK DUPLICATE EMAIL
            // ------------------------------------------

            const existingEmployee =
                await Employee.findOne({
                    email:
                        email.toLowerCase()
                });


            if (existingEmployee) {

                return res.render(
                    "add-employee",
                    {
                        error:
                            "Employee with this email already exists."
                    }
                );
            }


            // ------------------------------------------
            // GENERATE EMPLOYEE ID
            // ------------------------------------------

            let empid;

            do {

                empid =
                    generateEmployeeId();

            } while (
                await Employee.exists({
                    empid
                })
            );


            // ------------------------------------------
            // GENERATE PASSWORD
            // ------------------------------------------

            const generatedPassword =
                generatePassword(8);


            console.log(
                "Generated Employee ID:",
                empid
            );

            console.log(
                "Generated Employee Password:",
                generatedPassword
            );


            // ------------------------------------------
            // SALARY CALCULATION
            // ------------------------------------------

            // HRA = 20%
            const hra =
                basic * 0.20;


            // DA = 10%
            const da =
                basic * 0.10;


            // Gross Salary
            const grossSalary =
                basic +
                hra +
                da;


            // PF = 12%
            const pf =
                basic * 0.12;


            // Tax = 5%
            const tax =
                grossSalary * 0.05;


            // Net Salary
            const netSalary =
                grossSalary -
                pf -
                tax;


            // ------------------------------------------
            // ENCRYPT / HASH PASSWORD
            // ------------------------------------------

            const hashedPassword =
                await bcrypt.hash(
                    generatedPassword,
                    10
                );


            // ------------------------------------------
            // CREATE EMPLOYEE
            // ------------------------------------------

            const employee =
                new Employee({

                    empid,

                    name,

                    email:
                        email.toLowerCase(),

                    department,

                    designation,

                    basicSalary:
                        basic,

                    hra,

                    da,

                    grossSalary,

                    pf,

                    tax,

                    netSalary,

                    password:
                        hashedPassword
                });


            await employee.save();


            // ------------------------------------------
            // SEND EMAIL
            // ------------------------------------------

            try {

                await transporter.sendMail({

                    from:
                        process.env.EMAIL_USER,

                    to:
                        email,

                    subject:
                        "ERP Employee Account Created",

                    html: `

                        <h2>
                            Welcome to ERP System
                        </h2>

                        <p>
                            Dear ${name},
                        </p>

                        <p>
                            Your employee account
                            has been created successfully.
                        </p>

                        <table
                            border="1"
                            cellpadding="10"
                            cellspacing="0"
                        >

                            <tr>
                                <td>
                                    <strong>
                                        Employee ID
                                    </strong>
                                </td>

                                <td>
                                    ${empid}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Login Password
                                    </strong>
                                </td>

                                <td>
                                    ${generatedPassword}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Department
                                    </strong>
                                </td>

                                <td>
                                    ${department}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Designation
                                    </strong>
                                </td>

                                <td>
                                    ${designation}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Basic Salary
                                    </strong>
                                </td>

                                <td>
                                    ₹${basic.toFixed(2)}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Gross Salary
                                    </strong>
                                </td>

                                <td>
                                    ₹${grossSalary.toFixed(2)}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        Net Salary
                                    </strong>
                                </td>

                                <td>
                                    ₹${netSalary.toFixed(2)}
                                </td>
                            </tr>

                        </table>

                        <br>

                        <p>
                            Please keep your
                            login credentials secure.
                        </p>
                    `
                });


                console.log(
                    `Email sent to ${email}`
                );

            } catch (emailError) {

                console.error(
                    "Email sending failed:",
                    emailError.message
                );
            }


            // ------------------------------------------
            // REDIRECT
            // ------------------------------------------

            return res.redirect(
                "/employees?message=" +
                encodeURIComponent(
                    "Employee created successfully"
                )
            );

        } catch (error) {

            console.error(
                "Employee creation error:",
                error
            );

            return res.render(
                "add-employee",
                {
                    error:
                        "Unable to create employee."
                }
            );
        }
    }
);


// ==================================================
// EDIT EMPLOYEE - GET
// ==================================================

app.get(
    "/employees/edit/:id",
    isAdmin,
    async (req, res) => {

        try {

            const employee =
                await Employee.findById(
                    req.params.id
                );


            if (!employee) {

                return res
                    .status(404)
                    .send(
                        "Employee not found."
                    );
            }


            res.render(
                "edit-employee",
                {
                    employee,
                    error: null
                }
            );

        } catch (error) {

            console.error(error);

            res
                .status(500)
                .send(
                    "Server error."
                );
        }
    }
);


// ==================================================
// EDIT EMPLOYEE - POST
// ==================================================

app.post(
    "/employees/edit/:id",
    isAdmin,
    async (req, res) => {

        try {

            const {
                name,
                email,
                department,
                designation,
                basicSalary
            } = req.body;


            const basic =
                Number(basicSalary);


            if (
                Number.isNaN(basic) ||
                basic <= 0
            ) {

                return res.redirect(
                    "/employees?error=" +
                    encodeURIComponent(
                        "Invalid salary."
                    )
                );
            }


            // Salary calculation

            const hra =
                basic * 0.20;

            const da =
                basic * 0.10;

            const grossSalary =
                basic +
                hra +
                da;

            const pf =
                basic * 0.12;

            const tax =
                grossSalary * 0.05;

            const netSalary =
                grossSalary -
                pf -
                tax;


            await Employee.findByIdAndUpdate(

                req.params.id,

                {
                    name,

                    email:
                        email.toLowerCase(),

                    department,

                    designation,

                    basicSalary:
                        basic,

                    hra,

                    da,

                    grossSalary,

                    pf,

                    tax,

                    netSalary
                },

                {
                    runValidators: true
                }
            );


            return res.redirect(
                "/employees?message=" +
                encodeURIComponent(
                    "Employee updated successfully"
                )
            );

        } catch (error) {

            console.error(error);

            return res.redirect(
                "/employees?error=" +
                encodeURIComponent(
                    "Unable to update employee."
                )
            );
        }
    }
);


// ==================================================
// DELETE EMPLOYEE
// ==================================================

app.post(
    "/employees/delete/:id",
    isAdmin,
    async (req, res) => {

        try {

            await Employee.findByIdAndDelete(
                req.params.id
            );


            return res.redirect(
                "/employees?message=" +
                encodeURIComponent(
                    "Employee deleted successfully"
                )
            );

        } catch (error) {

            console.error(error);

            return res.redirect(
                "/employees?error=" +
                encodeURIComponent(
                    "Unable to delete employee."
                )
            );
        }
    }
);


// ==================================================
// LOGOUT
// ==================================================

app.get(
    "/logout",
    isAdmin,
    (req, res) => {

        req.session.destroy(
            (error) => {

                if (error) {

                    return res
                        .status(500)
                        .send(
                            "Unable to logout."
                        );
                }

                res.redirect("/login");
            }
        );
    }
);


// ==================================================
// START SERVER
// ==================================================

app.listen(
    PORT,
    () => {

        console.log(
            `ERP Admin Panel running at http://localhost:${PORT}`
        );
    }
);