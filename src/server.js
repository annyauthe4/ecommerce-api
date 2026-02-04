require('dotenv').config();

const fs = require('fs');
const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
