import express from 'express';
import cors from 'cors';
import connectDB from './src/config/dbConnect.js';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import {config} from './src/config/envConfig.js'

dotenv.config();
const app = express();
const PORT = config.port;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT,async()=>{
    await connectDB();
    console.log("Server is runningg...");
})