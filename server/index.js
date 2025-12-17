require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - SIMPLIFY FOR NOW
// CORS Configuration - SIMPLIFY FOR NOW
app.use(cors({
   origin: ['https://habit-tracker-app-frontend-habit-tracker.onrender.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// MongoDB Connection - IMPROVED WITH TIMEOUT
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    // Add connection timeout options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Don't crash the app, but log the error
    process.exit(1); // Exit with failure
  }
};

// Call the function to connect
connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));

app.get('/', (req, res) => {
  res.send('Habit Tracker API is running!');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Start the server - EVEN IF MONGODB FAILS
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});