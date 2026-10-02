const express = require("express");

const router = express.Router();

const Student = require("../models/Student");


// =============================
// CREATE STUDENT
// =============================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            age,
            course
        } = req.body;


        if (!name || !email || !age || !course) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        const student = await Student.create({
            name,
            email,
            age,
            course
        });


        res.status(201).json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error creating student"
        });

    }

});


// =============================
// GET ALL STUDENTS
// =============================

router.get("/", async (req, res) => {

    try {

        const students = await Student.findAll({
            order: [["id", "ASC"]]
        });


        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error getting students"
        });

    }

});


// =============================
// GET SINGLE STUDENT
// =============================

router.get("/:id", async (req, res) => {

    try {

        const student = await Student.findByPk(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error getting student"
        });

    }

});


// =============================
// UPDATE STUDENT
// =============================

router.put("/:id", async (req, res) => {

    try {

        const student = await Student.findByPk(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        const {
            name,
            email,
            age,
            course
        } = req.body;


        if (!name || !email || !age || !course) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        await student.update({
            name,
            email,
            age,
            course
        });


        res.json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error updating student"
        });

    }

});


// =============================
// DELETE STUDENT
// =============================

router.delete("/:id", async (req, res) => {

    try {

        const student = await Student.findByPk(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        await student.destroy();


        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error deleting student"
        });

    }

});


module.exports = router;