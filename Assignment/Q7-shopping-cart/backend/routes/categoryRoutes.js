const express = require("express");

const Category = require("../models/Category");

const {
    auth,
    adminOnly
} = require("../middleware/auth");

const router = express.Router();


// =====================================
// GET ALL CATEGORIES
// =====================================

router.get("/", async (req, res) => {

    try {

        const categories =
            await Category
                .find()
                .populate("parent", "name")
                .sort({ name: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch categories"
        });
    }
});


// =====================================
// GET PARENT CATEGORIES
// =====================================

router.get("/parents", async (req, res) => {

    try {

        const categories =
            await Category.find({
                parent: null
            });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch parent categories"
        });
    }
});


// =====================================
// CREATE CATEGORY
// =====================================

router.post(
    "/",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                parent
            } = req.body;

            if (!name) {

                return res.status(400).json({
                    message: "Category name is required"
                });
            }

            const category =
                await Category.create({

                    name,

                    parent: parent || null
                });

            res.status(201).json(category);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Unable to create category"
            });
        }
    }
);


// =====================================
// UPDATE CATEGORY
// =====================================

router.put(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                parent
            } = req.body;

            const category =
                await Category.findByIdAndUpdate(

                    req.params.id,

                    {
                        name,
                        parent: parent || null
                    },

                    {
                        new: true
                    }
                );

            if (!category) {

                return res.status(404).json({
                    message: "Category not found"
                });
            }

            res.json(category);

        } catch (error) {

            res.status(500).json({
                message: "Unable to update category"
            });
        }
    }
);


// =====================================
// DELETE CATEGORY
// =====================================

router.delete(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const category =
                await Category.findById(
                    req.params.id
                );

            if (!category) {

                return res.status(404).json({
                    message: "Category not found"
                });
            }


            // Do not allow deleting a parent
            // if it has child categories.

            const child =
                await Category.findOne({
                    parent: category._id
                });

            if (child) {

                return res.status(400).json({
                    message:
                        "Delete child categories first"
                });
            }


            await Category.findByIdAndDelete(
                req.params.id
            );


            res.json({
                message: "Category deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Unable to delete category"
            });
        }
    }
);


module.exports = router;