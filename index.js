"use strict";

// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

// Import necessary modules
const mongoose = require("mongoose");
const { notFound, errorHandler } = require("./middlewares/globalErrorHandler"); // Import custom error handlers

const express = require("express");
const createHttpError = require("http-errors");
const application = express();
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js")
const orderRoutes = require("./routes/order.js");
const tableRoutes = require("./routes/table.js");
const cookieParser = require("cookie-parser");
const cors = require("cors")

// Middleware to parse JSON
application.use(express.json()); 

// Middleware to parse URL-encoded data (optional)
application.use(cors({
    origin: "http://localhost:5173 ",
    credentials: true
})
); 
application.use(express.urlencoded({ extended: true }));
application.use(cookieParser());


// Set the port for the server, defaulting to 3000 if not set in environment variables
const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL; // MongoDB connection URL from .env

//handling routes
application.use("/auth", authRoutes);
application.use("/user", userRoutes);
application.use("/order",orderRoutes)
application.use("/table", tableRoutes); 

// Middleware to handle 404 errors and global errors
application.use(notFound);
application.use(errorHandler);


// Function to connect to MongoDB with retry logic
async function connectWithRetry() {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(MONGOURL,
            {
                // Options to deal with deprecation warnings
                // useCreateIndex: true,
                // useFindAndModify: false,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }
        );
      

        // If the database connection is successful, start the server
        application.listen(port, '127.0.0.1', () => {
            console.log('Server listening on port 8000');
            console.log(`Database has been connected and server is running on port ${port}`);
        });

    } catch (error) {
        // Log any connection errors and retry after 5 seconds
        console.log(`Database connection error: ${error.message}`);
        setTimeout(connectWithRetry, 5000);
    }
}

// Attempt to connect to the database when the server starts
connectWithRetry();

// Graceful shutdown handling (Optional but recommended)
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    process.exit(0); // Exit gracefully
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process after handling the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Exit the process after handling the rejection
});

