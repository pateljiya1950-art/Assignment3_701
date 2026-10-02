const express = require("express");

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const { auth } = require("../middleware/auth");

const router = express.Router();


// ========================================
// GET CART
// ========================================

router.get("/", auth, async (req, res) => {

    try {

        let cart =
            await Cart
                .findOne({
                    user: req.user.userId
                })
                .populate("items.product");


        if (!cart) {

            cart = await Cart.create({
                user: req.user.userId,
                items: []
            });
        }


        res.json(cart);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch cart"
        });
    }
});


// ========================================
// ADD PRODUCT TO CART
// ========================================

router.post("/add", auth, async (req, res) => {

    try {

        const {
            productId,
            quantity
        } = req.body;


        const product =
            await Product.findById(productId);


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }


        const qty =
            Number(quantity) || 1;


        if (qty < 1) {

            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }


        if (product.stock < qty) {

            return res.status(400).json({
                message: "Insufficient stock"
            });
        }


        let cart =
            await Cart.findOne({
                user: req.user.userId
            });


        if (!cart) {

            cart = new Cart({
                user: req.user.userId,
                items: []
            });
        }


        const existingItem =
            cart.items.find(
                item =>
                    item.product.toString() ===
                    productId
            );


        if (existingItem) {

            const newQuantity =
                existingItem.quantity + qty;


            if (newQuantity > product.stock) {

                return res.status(400).json({
                    message:
                        "Quantity exceeds available stock"
                });
            }


            existingItem.quantity =
                newQuantity;

        } else {

            cart.items.push({
                product: productId,
                quantity: qty
            });
        }


        await cart.save();


        const populated =
            await cart.populate(
                "items.product"
            );


        res.json(populated);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add product to cart"
        });
    }
});


// ========================================
// UPDATE CART QUANTITY
// ========================================

router.put("/update", auth, async (req, res) => {

    try {

        const {
            productId,
            quantity
        } = req.body;


        const qty = Number(quantity);


        if (qty < 1) {

            return res.status(400).json({
                message:
                    "Quantity must be at least 1"
            });
        }


        const product =
            await Product.findById(productId);


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }


        if (qty > product.stock) {

            return res.status(400).json({
                message: "Insufficient stock"
            });
        }


        const cart =
            await Cart.findOne({
                user: req.user.userId
            });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });
        }


        const item =
            cart.items.find(
                item =>
                    item.product.toString() ===
                    productId
            );


        if (!item) {

            return res.status(404).json({
                message: "Product not in cart"
            });
        }


        item.quantity = qty;


        await cart.save();


        const populated =
            await cart.populate(
                "items.product"
            );


        res.json(populated);

    } catch (error) {

        res.status(500).json({
            message:
                "Unable to update cart"
        });
    }
});


// ========================================
// REMOVE PRODUCT FROM CART
// ========================================

router.delete(
    "/remove/:productId",
    auth,
    async (req, res) => {

        try {

            const cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                return res.status(404).json({
                    message: "Cart not found"
                });
            }


            cart.items =
                cart.items.filter(
                    item =>
                        item.product.toString() !==
                        req.params.productId
                );


            await cart.save();


            const populated =
                await cart.populate(
                    "items.product"
                );


            res.json(populated);

        } catch (error) {

            res.status(500).json({
                message:
                    "Unable to remove product"
            });
        }
    }
);


// ========================================
// CLEAR CART
// ========================================

router.delete(
    "/clear",
    auth,
    async (req, res) => {

        try {

            const cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                return res.json({
                    items: []
                });
            }


            cart.items = [];


            await cart.save();


            res.json(cart);

        } catch (error) {

            res.status(500).json({
                message:
                    "Unable to clear cart"
            });
        }
    }
);


module.exports = router;