require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");


async function createAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );


        const email =
            "admin@gmail.com";

        const password =
            "admin123";


        const existing =
            await User.findOne({
                email
            });


        if (existing) {

            console.log(
                "Admin already exists"
            );

            process.exit();
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const admin =
            await User.create({

                name: "Admin",

                email,

                password:
                    hashedPassword,

                role: "admin"
            });


        console.log(
            "Admin created successfully"
        );

        console.log(
            "Email:",
            admin.email
        );

        console.log(
            "Password:",
            password
        );

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
}


createAdmin();