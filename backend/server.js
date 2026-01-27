const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
const authRoutes=require('./routes/authRoutes');
const connectDB=require('./config/db');
const taskRoutes=require('./routes/taskRoutes');
connectDB();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API is running...");
});

app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);   
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server running on port ${process.env.PORT||3000}`);
});
