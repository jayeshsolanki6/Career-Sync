import express from 'express'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import analysisRoutes from './routes/analysis.routes.js'
import learningRoutes from './routes/learning.routes.js'


const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieparser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use('/api/auth', authRoutes);
app.use('/api/upload', analysisRoutes);
app.use('/api/learning', learningRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on PORT : ${PORT}.`);
})