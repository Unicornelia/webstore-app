require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// DB import
const { mongoConnect } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve React Frontend
app.use(express.json());
const clientBuildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(clientBuildPath, 'index.html'));
// });

// Import Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Use Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Start Server with MongoDB
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT} 📡`);
  });
});
