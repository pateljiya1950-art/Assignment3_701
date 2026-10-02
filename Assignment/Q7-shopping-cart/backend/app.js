require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const categoryRoutes =
    require("./routes/categoryRoutes");

const productRoutes =
    require("./routes/productRoutes");

const cartRoutes =
    require("./routes/cartRoutes");


const app = express();


// =================================
// Database
// =================================

connectDB();


// =================================
// Middleware
// =================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ]
    })
);

app.use(express.json());


// =================================
// Routes
// =================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);


// =================================
// Test
// =================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Q7 Shopping Cart API is running"
    });
});


// =================================
// Server
// =================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);