const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
    body,
    validationResult
} = require("express-validator");

const app = express();

const PORT = 3000;

/* =========================================================
   UPLOAD DIRECTORY
   ========================================================= */

const uploadDir = path.join(__dirname, "uploads");

// Create uploads folder automatically
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

/* =========================================================
   EXPRESS CONFIGURATION
   ========================================================= */

// EJS template engine
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({
    extended: true
}));

// Make uploaded files accessible from browser
app.use("/uploads", express.static(uploadDir));

/* =========================================================
   MULTER STORAGE CONFIGURATION
   ========================================================= */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const extension = path.extname(file.originalname);

        const fileName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extension;

        cb(null, fileName);
    }

});

/* =========================================================
   FILE VALIDATION
   ========================================================= */

// Allowed image MIME types
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
];

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
        files: 6
    },

    fileFilter: function (req, file, cb) {

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG, GIF and WEBP image files are allowed."
                )
            );

        }
    }

});

/* =========================================================
   GET REGISTRATION FORM
   ========================================================= */

app.get("/", function (req, res) {

    res.render("form", {
        errors: [],
        values: {}
    });

});

/* =========================================================
   VALIDATION RULES
   ========================================================= */

const validationRules = [

    // Username
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({
            min: 3,
            max: 30
        })
        .withMessage("Username must be between 3 and 30 characters."),

    // Password
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({
            min: 6
        })
        .withMessage("Password must contain at least 6 characters."),

    // Confirm password
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom(function (value, { req }) {

            return value === req.body.password;

        })
        .withMessage("Password and confirm password do not match."),

    // Email
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address."),

    // Gender
    body("gender")
        .notEmpty()
        .withMessage("Please select gender.")
        .isIn([
            "Male",
            "Female",
            "Other"
        ])
        .withMessage("Invalid gender selected."),

    // Hobbies
    body("hobbies")
        .optional()
        .custom(function (value) {

            const hobbies = Array.isArray(value)
                ? value
                : [value];

            const allowedHobbies = [
                "Reading",
                "Sports",
                "Music",
                "Coding"
            ];

            return hobbies.every(function (hobby) {
                return allowedHobbies.includes(hobby);
            });

        })
        .withMessage("Invalid hobby selected.")

];

/* =========================================================
   REGISTRATION ROUTE
   ========================================================= */

app.post(
    "/register",

    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        },
        {
            name: "otherPics",
            maxCount: 5
        }
    ]),

    validationRules,

    function (req, res) {

        // Get validation errors
        const validationErrors = validationResult(req);

        const errors = validationErrors.array();

        /*
         * Add profile picture validation
         */

        if (
            !req.files ||
            !req.files.profilePic ||
            req.files.profilePic.length === 0
        ) {

            errors.push({
                msg: "Profile picture is required.",
                path: "profilePic"
            });

        }

        /*
         * If errors exist
         */

        if (errors.length > 0) {

            return res.status(400).render("form", {

                errors: errors,

                values: req.body

            });

        }

        /* =====================================================
           GET UPLOADED FILES
           ===================================================== */

        const profilePic =
            req.files.profilePic[0];

        const otherPics =
            req.files.otherPics || [];

        /* =====================================================
           HOBBIES
           ===================================================== */

        let hobbies = [];

        if (req.body.hobbies) {

            hobbies = Array.isArray(req.body.hobbies)
                ? req.body.hobbies
                : [req.body.hobbies];

        }

        /* =====================================================
           FINAL DATA
           ===================================================== */

        const userData = {

            username: req.body.username,

            email: req.body.email,

            gender: req.body.gender,

            hobbies: hobbies,

            profilePic: profilePic,

            otherPics: otherPics

        };

        /* =====================================================
           DISPLAY RESULT
           ===================================================== */

        res.render("result", {

            data: userData

        });

    }
);

/* =========================================================
   DOWNLOAD FILE ROUTE
   ========================================================= */

app.get(
    "/download/:filename",
    function (req, res) {

        /*
         * basename prevents path traversal.
         */

        const safeFilename =
            path.basename(req.params.filename);

        const filePath =
            path.join(uploadDir, safeFilename);

        /*
         * Check file exists
         */

        if (!fs.existsSync(filePath)) {

            return res.status(404).send(
                "File not found."
            );

        }

        /*
         * Download file
         */

        res.download(
            filePath,
            safeFilename,
            function (err) {

                if (err) {

                    console.log(
                        "Download error:",
                        err
                    );

                }

            }
        );

    }
);

/* =========================================================
   MULTER / FILE ERROR HANDLER
   ========================================================= */

app.use(function (err, req, res, next) {

    console.log(err);

    if (
        err instanceof multer.MulterError
    ) {

        let message = err.message;

        if (err.code === "LIMIT_FILE_SIZE") {

            message =
                "File size must not exceed 2 MB.";

        }

        if (err.code === "LIMIT_FILE_COUNT") {

            message =
                "Maximum 6 files are allowed.";

        }

        return res.status(400).render(
            "form",
            {
                errors: [
                    {
                        msg: message
                    }
                ],

                values: req.body || {}
            }
        );

    }

    /*
     * Custom file validation error
     */

    if (err) {

        return res.status(400).render(
            "form",
            {
                errors: [
                    {
                        msg: err.message
                    }
                ],

                values: req.body || {}
            }
        );

    }

    next(err);

});

/* =========================================================
   START SERVER
   ========================================================= */

app.listen(
    PORT,
    function () {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);