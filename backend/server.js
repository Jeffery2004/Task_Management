const express=require('express');
const cors=require('cors');
const app=express();
const authRoutes=require('./routes/authRoutes');
const connectDB=require('./config/db');
const taskRoutes=require('./routes/taskRoutes');
const authMiddleware=require('./middleware/authMiddleware');
const {Server}=require('socket.io');

require('dotenv').config();

const server=require('http').createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});
app.set('io',io);
io.on('connection',(socket)=>{
    console.log('New client connected: ',socket.id);
    socket.on('disconnect',()=>{
        console.log('Client disconnected: ',socket.id);
    });
});

connectDB();
app.use(cors());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/tasks',authMiddleware,taskRoutes);   
server.listen(process.env.PORT||3000,()=>{
    console.log(`Server running on port ${process.env.PORT||3000}`);
});
