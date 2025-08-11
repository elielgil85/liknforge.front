// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// --- CORS Configuration ---
// No longer needed with Next.js proxy

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model ---
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

// --- Express App Setup ---
const app = express();
app.use(cors()); // Using basic cors for simplicity, can be locked down if needed.
app.use(express.json()); // Middleware to parse JSON bodies

// --- Helper Function ---
// Generates a random alphanumeric string of a given length.
function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- API Routes ---

/**
 * @route GET /
 * @description Shows a simple status page for the API.
 * @access Public
 */
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API LinkForge</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          margin: 0; 
          background-color: #f0f2f5; 
          color: #333; 
        }
        .container { 
          text-align: center; 
          padding: 50px; 
          background-color: white; 
          border-radius: 12px; 
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }
        h1 { 
          font-size: 2.8em; 
          color: #0d6efd; 
          margin-bottom: 0.5em; 
        }
        p { 
          font-size: 1.3em; 
          color: #555; 
        }
        .status {
          display: inline-block;
          margin-top: 1em;
          padding: 10px 20px;
          background-color: #198754;
          color: white;
          font-weight: bold;
          border-radius: 50px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>API LinkForge</h1>
        <p>O serviço de back-end está operando.</p>
        <div class="status">API Funcional</div>
      </div>
    </body>
    </html>
  `);
});


/**
 * @route POST /shorten
 * @description Creates a short URL for a given long URL.
 * @access Public
 */
app.post('/shorten', async (req, res) => {
  const { long_url } = req.body;

  // Basic validation for the long URL
  if (!long_url || !long_url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid URL starting with http/https is required.' });
  }

  try {
    let shortCode;
    let isUnique = false;

    // Ensure the generated short code is unique
    while (!isUnique) {
      shortCode = generateShortCode();
      const existing = await Url.findOne({ short_code: shortCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Save the new URL to the database
    const newUrl = new Url({
      original_url: long_url,
      short_code: shortCode
    });

    await newUrl.save();

    res.status(201).json({ short_code: shortCode });

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error while creating short URL.' });
  }
});

/**
 * @route GET /:shortCode
 * @description Retrieves the original URL associated with the short code.
 *              Always returns JSON. The frontend is responsible for redirection.
 * @access Public
 */
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  // This check prevents treating requests for favicon or other assets as short codes
  if (shortCode.includes('.')) {
      return res.status(404).json({ error: 'Not a valid short code.' });
  }

  try {
    const urlEntry = await Url.findOne({ short_code: shortCode });

    if (urlEntry) {
      // Always return the long URL as JSON
      return res.status(200).json({ long_url: urlEntry.original_url });
    } else {
      // If the short code is not found, send a 404 response
      return res.status(404).json({ error: 'Short URL not found.' });
    }
  } catch (error) {
    console.error('Error handling short code:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});


// --- Server Initialization ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
