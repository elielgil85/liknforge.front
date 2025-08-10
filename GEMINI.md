# AI Guide: Building a Temporary Backend for URL Shortening

This document provides instructions for the AI to build a temporary backend for URL shortening using Express.js and MongoDB Atlas. The backend will be created in a new directory named `backend-temp`.

## Instructions for the AI:

1.  **Create Project Directory:**
    - Create a new directory named `backend-temp` in the root of the workspace.

2.  **Initialize Node.js Project:**
    - Navigate into the `/workspace/backend-temp` directory.
    - Initialize a new Node.js project with default settings.

3.  **Install Dependencies:**
    - Install the following npm packages in the `/workspace/backend-temp` directory:
        - `express`: For building the web server and handling routes.
        - `mongoose`: For interacting with MongoDB.
        - `dotenv`: For loading environment variables from a `.env` file.

4.  **Create .env File:**
    - In the `/workspace/backend-temp` directory, create a file named `.env`.
    - Add a variable `MONGODB_URI` to this file to store the MongoDB Atlas connection string. (Example: `MONGODB_URI=your_mongodb_connection_string`)

5.  **Create Server File:**
    - In the `/workspace/backend-temp` directory, create a file named `server.js`.
    - Implement the server logic in `server.js`:
        - Import necessary modules (`express`, `mongoose`, `dotenv`).
        - Load environment variables using `dotenv`.
        - Connect to MongoDB Atlas using `mongoose` and the `MONGODB_URI` from `.env`. Handle connection success and error logging.
        - Define an Express application instance.
        - Implement routes for URL shortening:
            - A POST route (e.g., `/shorten`) that accepts a long URL in the request body, generates a short code, saves both to the MongoDB database, and responds with the short URL.
            - A GET route (e.g., `/:shortCode`) that retrieves the long URL from the database based on the provided short code and redirects the user to the long URL.
        - Start the Express server to listen on a specified port (e.g., 3001). Log a message indicating the server is running and on which port.

6.  **Create URL Model:**
    - In the `/workspace/backend-temp` directory, create a file named `models/Url.js`.
    - Define a Mongoose schema and model for storing URL information (long URL and short code).


