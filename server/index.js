require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');

// DB import
const { mongoConnect } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client/build')));

// API Route Example
app.get('/api', (req, res) => {
  res.json({ message: 'Hi from the Server' });
});

// Import Routes
// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

// Use Routes
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// Serve React Frontend
const clientBuildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// 404 Error Handler
app.use(errorController.get404Page);

// Start Server with MongoDB
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT} 📡`);
  });
});
