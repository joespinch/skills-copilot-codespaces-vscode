// Create web server and listen to port 3000

// Import express module
const express = require('express');

// Create express app
const app = express();

// Import createComment function from commentController.js
const { createComment } = require('./controllers/commentController');

// Import connectDB function from db.js
const { connectDB } = require('./models/db');

// Import Comment model from db.js
const Comment = require('./models/Comment');

// Import dotenv module
const dotenv = require('dotenv');

// Import body-parser module
const bodyParser = require('body-parser');

// Import cors module
const cors = require('cors');

// Import express-validator module
const { check, validationResult } = require('express-validator');

// Configure dotenv
dotenv.config();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure cors
app.use(cors());

// Connect to MongoDB
connectDB();

// Create new comment
app.post('/comment', [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('Email is required'),
    check('comment')
        .not()
        .isEmpty()
        .withMessage('Comment is required')
],
    (req, res) => {
        // Check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // Create new comment
        const comment = new Comment({
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment
        });

        // Save comment
        comment.save()
            .then(comment => {
                res.json(comment);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the Comment.'
                });
            });
    });

// Listen to port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
