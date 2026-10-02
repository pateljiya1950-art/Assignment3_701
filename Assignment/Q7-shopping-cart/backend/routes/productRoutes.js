const express = require("express");

const Product = require("../models/Product");

const {
    auth,
    adminOnly
} = require("../middleware/auth");

const router = express.Router();


// =======================================
// GET ALL PRODUCTS
// =======================================

router.get("/", async (req, res) => {

    try {

        const products =
            await Product
                .find()
                .populate("category", "name parent")
                .sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch products"
        });
    }
});


// =======================================
// GET PRODUCTS BY CATEGORY
// =======================================

router.get(
    "/category/:categoryId",
    async (req, res) => {

        try {

            const products =
                await Product
                    .find({
                        category:
                            req.params.categoryId
                    })
                    .populate(
                        "category",
                        "name"
                    );

            res.json(products);

        } catch (error) {

            res.status(500).json({
                message:
                    "Unable to fetch category products"
            });
        }
    }
);


// =======================================
// GET SINGLE PRODUCT
// =======================================

router.get("/:id", async (req, res) => {

    try {

        const product =
            await Product
                .findById(req.params.id)
                .populate(
                    "category",
                    "name parent"
                );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch product"
        });
    }
});


// =======================================
// CREATE PRODUCT
// =======================================

router.post(
    "/",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                image,
                stock,
                category
            } = req.body;


            if (
                !name ||
                price === undefined ||
                stock === undefined ||
                !category
            ) {

                return res.status(400).json({
                    message:
                        "Name, price, stock and category are required"
                });
            }


            const product =
                await Product.create({

                    name,

                    description,

                    price: Number(price),

                    image,

                    stock: Number(stock),

                    category
                });


            const populated =
                await product.populate(
                    "category",
                    "name"
                );


            res.status(201).json(populated);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Unable to create product"
            });
        }
    }
);


// =======================================
// UPDATE PRODUCT
// =======================================

router.put(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                image,
                stock,
                category
            } = req.body;


            const product =
                await Product.findByIdAndUpdate(

                    req.params.id,

                    {
                        name,
                        description,
                        price: Number(price),
                        image,
                        stock: Number(stock),
                        category
                    },

                    {
                        new: true
                    }
                )
                .populate(
                    "category",
                    "name"
                );


            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });
            }


            res.json(product);

        } catch (error) {

            res.status(500).json({
                message: "Unable to update product"
            });
        }
    }
);


// =======================================
// DELETE PRODUCT
// =======================================

router.delete(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

        try {

            const product =
                await Product.findByIdAndDelete(
                    req.params.id
                );

            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message:
                    "Product deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Unable to delete product"
            });
        }
    }
);


module.exports = router;