const express = require("express");
const session = require("express-session");
const { createClient } = require("redis");
const { RedisStore } = require("connect-redis");

const app = express();

const PORT = 3000;

// --------------------------------------------------
// Express configuration
// --------------------------------------------------

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Redis client
// --------------------------------------------------

const redisClient = createClient({
    url: "redis://localhost:6379"
});

// Redis error handling
redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

// --------------------------------------------------
// Dummy user
// --------------------------------------------------

const USER = {
    username: "admin",
    password: "123456",
    email: "admin@example.com"
};

// --------------------------------------------------
// Start Redis and Express
// --------------------------------------------------

async function startServer() {

    try {

        // Connect to Redis
        await redisClient.connect();

        console.log("Connected to Redis");

        // --------------------------------------------------
        // Session configuration
        // --------------------------------------------------

        app.use(
            session({
                store: new RedisStore({
                    client: redisClient,
                    prefix: "myapp:"
                }),

                secret: "my-super-secret-key",

                resave: false,

                saveUninitialized: false,

                cookie: {
                    maxAge: 1000 * 60 * 30
                }
            })
        );

        // --------------------------------------------------
        // Home route
        // --------------------------------------------------

        app.get("/", (req, res) => {

            if (req.session.user) {
                return res.redirect("/dashboard");
            }

            res.redirect("/login");
        });

        // --------------------------------------------------
        // Login page
        // --------------------------------------------------

        app.get("/login", (req, res) => {

            if (req.session.user) {
                return res.redirect("/dashboard");
            }

            res.render("login", {
                error: null
            });
        });

        // --------------------------------------------------
        // Login POST
        // --------------------------------------------------

        app.post("/login", (req, res) => {

            const { username, password } = req.body;

            // Check empty fields
            if (!username || !password) {

                return res.render("login", {
                    error: "Username and password are required."
                });
            }

            // Check credentials
            if (
                username === USER.username &&
                password === USER.password
            ) {

                // Create session
                req.session.user = {
                    username: USER.username,
                    email: USER.email
                };

                return res.redirect("/dashboard");
            }

            // Invalid login
            res.render("login", {
                error: "Invalid username or password."
            });
        });

        // --------------------------------------------------
        // Authentication middleware
        // --------------------------------------------------

        function isAuthenticated(req, res, next) {

            if (req.session.user) {
                next();
            } else {
                res.redirect("/login");
            }
        }

        // --------------------------------------------------
        // Protected Route 1
        // --------------------------------------------------

        app.get(
            "/dashboard",
            isAuthenticated,
            (req, res) => {

                res.render("dashboard", {
                    user: req.session.user
                });

            }
        );

        // --------------------------------------------------
        // Protected Route 2
        // --------------------------------------------------

        app.get(
            "/profile",
            isAuthenticated,
            (req, res) => {

                res.render("profile", {
                    user: req.session.user
                });

            }
        );

        // --------------------------------------------------
        // Logout
        // --------------------------------------------------

        app.get("/logout", (req, res) => {

            req.session.destroy((err) => {

                if (err) {

                    console.log("Logout error:", err);

                    return res
                        .status(500)
                        .send("Unable to logout.");
                }

                res.redirect("/login");

            });

        });

        // --------------------------------------------------
        // Start Express server
        // --------------------------------------------------

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Unable to connect to Redis:",
            error
        );

    }
}

startServer();