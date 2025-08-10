// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

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
app.use(cors()); // Enable Cross-Origin Resource Sharing
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
 * @description Redirects to the original URL associated with the short code.
 * @access Public
 */
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlEntry = await Url.findOne({ short_code: shortCode });

    if (urlEntry) {
      // Redirect to the original URL
      return res.redirect(301, urlEntry.original_url);
    } else {
      // If the short code is not found, send a 404 response
      return res.status(404).json({ error: 'Short URL not found.' });
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Server error while redirecting.' });
  }
});


// --- Server Initialization ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
