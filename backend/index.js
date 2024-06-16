const express = require('express');
const dbConnect = require('./config/db');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes.routes');
const postRouter = require('./routes/postRoutes.routes');
const profileRouter = require('./routes/profileRoutes.routes');
const notificationRouter = require('./routes/notificationRoutes.routes');
const chatRouter = require('./routes/chatRoutes.routes');
const {httpServer,app} = require('./sockets/socket')
require('dotenv').config();
const port  = process.env.port
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use('/api/v1',userRouter);
app.use('/api/v1',postRouter);
app.use('/api/v1',profileRouter)
app.use('/api/v1/notification',notificationRouter)
app.use('/api/v1/chat',chatRouter)
dbConnect()
httpServer.listen(port,()=>{
    console.log(`Listening at Port ${port}`)
})