const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const appointmentRoutes = require('./routes/appointments');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - with fallback for development
let dbConnected = false;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  dbConnected = true;
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('⚠️  Running in development mode without database. Data will not persist.');
  dbConnected = false;
});

// Make database connection status available to routes
app.locals.dbConnected = dbConnected;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check
app.get('/', (req, res) => res.send('New Janta Backend is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
