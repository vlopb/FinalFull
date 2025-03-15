const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configurar CORS para Express
app.use(cors());

// Configurar CORS en Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Aquí por la URL de tu frontend
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    console.log("@ Usuario conectado:", socket.id);

    socket.on("message", msg => {
        console.log("@ Mensaje recibido:", msg);
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("@ Usuario desconectado:", socket.id);
  });
});

// Iniciar servidor en el puerto 3010
server.listen(3010, () => {
    console.log("@ Servidor corriendo en http://localhost:3010");
});
