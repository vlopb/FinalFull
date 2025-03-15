module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');

        socket.on('message', (msg) => {
            console.log(`📩 Mensaje recibido: ${msg}`);
            io.emit('message', msg);
        });
        socket.on('disconnect', () => {
            console.log(`👋 Un usuario se ha desconectado ${socket.id}`);
        });
    });
};


