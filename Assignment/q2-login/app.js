const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3000;

// --------------------------------------------------
// Create sessions directory if it doesn't exist
// --------------------------------------------------

const sessionDir = path.join(__dirname, "sessions");

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Session configuration
// --------------------------------------------------

app.use(
    session({
        store: new FileStore({
            path: sessionDir,
            retries: 0
        }),

        secret: "my-secret-key-123",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// --------------------------------------------------
// Dummy user
// --------------------------------------------------

const USER = {
    username: "admin",
    password: "123456",
    email: "admin@example.com"
};

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

    // Validation
    if (!username || !password) {
        return res.render("login", {
            error: "Username and password are required."
        });
    }

    // Check username and password
    if (
        username === USER.username &&
        password === USER.password
    ) {

        // Store user information in session
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

app.get("/dashboard", isAuthenticated, (req, res) => {

    res.render("dashboard", {
        user: req.session.user
    });
});

// --------------------------------------------------
// Protected Route 2
// --------------------------------------------------

app.get("/profile", isAuthenticated, (req, res) => {

    res.render("profile", {
        user: req.session.user
    });
});

// --------------------------------------------------
// Logout
// --------------------------------------------------

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Unable to logout.");
        }

        res.redirect("/login");
    });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});