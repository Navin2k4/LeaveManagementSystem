import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import leaveRequestRoutes from './routes/leave.route.js';
import departmentRoutes from './routes/department.route.js';
import defaulterRoutes from './routes/defaulter.route.js';

dotenv.config();

// MongoDB connection setup
mongoose
    .connect(process.env.MONGO, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
    })
    .then(() => {
        console.log("MongoDb is connected");
    })
    .catch((err) => {
        console.log("MongoDb not connected", err);
    });

const __dirname = path.resolve();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your React frontend
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api", leaveRequestRoutes);
app.use('/api', departmentRoutes);
app.use('/api/defaulter', defaulterRoutes);

// Serve static files from React build (ensure 'client/dist' exists)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Fallback to index.html for other routes (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
