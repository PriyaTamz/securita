import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './Database/config.js';
import roleRouter from './Routes/RoleRouter.js';
import userManagementRouter from './Routes/UserManagementRouter.js';
import userRouter from './Routes/UserRouter.js';
import adminRouter from './Routes/AdminRouter.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3010',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); 

connectDB();

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/role', roleRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userManagementRouter);
app.use('/api/auth', userRouter);

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`)
})


