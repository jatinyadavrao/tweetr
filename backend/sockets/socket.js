const { createServer } = require('http');
const { Server } = require("socket.io");
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors:{
    origin:'*'
  }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", (message) => {
        console.log(`${message.content}`);
      console.log(message)
        socket.to(message.chatId).emit("receiveMessage", message);
    });

    socket.on('call-user', async (data) => {
        try {
            const offer = data.offer;
            const room = data.room;

            socket.to(room).emit('receive-call', { name: data.name, offer });

            socket.on('candidate', (candidate) => {
              socket.to(room).emit('candidate', candidate); })
        
        } catch (error) {
            console.error('Error calling user:', error);
        }
    });

    socket.on('accept-call', async (data) => {
        try {
            const answer = data.answer;
            const room = data.room;

            socket.to(room).emit('accept-call', { answer });
            socket.on('candidate', (candidate) => {
              socket.to(room).emit('candidate', candidate); })
                 
        } catch (error) {
            console.error('Error accepting call:', error);
        }});
   
  
    socket.on('reject-call', (data) => {
        const room = data.room;
        socket.to(room).emit('call-rejected');
    });

    socket.on('call:ended',(data)=>{
      socket.to(data.room).emit('call:end')
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

module.exports = { httpServer, app };
