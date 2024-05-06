const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/hotel', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

// User Model
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//login endpoint

// Additional required packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use user model for authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Room Schema
const roomSchema = new mongoose.Schema({
    type: String,
    price: Number,
    available: Boolean
  });
  
  // Room Model
  const Room = mongoose.model('Room', roomSchema);
  
  // Booking Endpoint
  app.post('/book-room', async (req, res) => {
    try {
      const { roomType, checkInDate, checkOutDate } = req.body;
      // Logic to check room availability and make a booking
      // ...
      res.send('Room booked');
    } catch (error) {
      res.status(500).send('Error booking room');
    }
  });
  