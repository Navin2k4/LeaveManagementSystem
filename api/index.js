import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// import departmentRoutes from './routes/department.route.js';

// import path from 'path';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(async () => {
        console.log("MongoDb is connected");
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        collections.forEach(collection => {
            console.log(collection.name);
        });
    }).catch(err => {
        console.log("MongoDb not connected");
    });


// const __dirname = path.resolve();

// Creating the app
const app = express();

app.use(express.json());
app.use(cookieParser());



// Creating test API
// app.use('/api/departments', departmentRoutes);


// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})