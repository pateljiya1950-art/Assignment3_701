const express = require("express");
const cors = require("cors");

const sequelize = require("./database");

require("./models/Student");

const studentRoutes = require("./routes/studentRoutes");


const app = express();


// =============================
// MIDDLEWARE
// =============================

app.use(cors());

app.use(express.json());


// =============================
// HOME ROUTE
// =============================

app.get("/", (req, res) => {

    res.send("Student CRUD API is running");

});


// =============================
// STUDENT ROUTES
// =============================

app.use("/api/students", studentRoutes);


// =============================
// START SERVER
// =============================

const PORT = 5000;


async function startServer() {

    try {

        await sequelize.authenticate();

        console.log(
            "SQLite database connected successfully"
        );


        await sequelize.sync();

        console.log(
            "Students table created successfully"
        );


        app.listen(PORT, () => {

            console.log(
                `Backend running at http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Unable to connect to database:"
        );

        console.error(error);

    }

}


startServer();