import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from "cors";
import { processTailorRequest, upload } from './routes/tailor.js'; // Import helper and middleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API route for resume tailoring
app.post('/api/tailor', upload.single('resume'), processTailorRequest);

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
