import { Server } from "socket.io";

const SocketHandler = (req, res) => {
    console.log("called api");
    if (res.socket.server.io) {
        console.log("socket already running");
    } else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log("server is connected");

            socket.emit("connected");

            socket.on('user-leave', (koko) => {
                console.log("user gone", koko);
            });

            socket.on('setup', (userData) => {
                if (!userData) {
                    console.error("No user data provided for setup.");
                    return;
                }
                console.log("setup done");
                socket.join(userData._id);
            });

            socket.on('join room', (room) => {
                socket.join(room);
                console.log("user joined " + room);
            });



            socket.on('new member joinded request', (member) => {
                console.log(member);
                io.emit('new member joined', member); // Emit to all connected clients
            });

            socket.on('sendMessage', (message) => {
                socket.emit('messageReceived', message)
                io.to(message.receiver).emit('messageReceived', message);
 
            })

            socket.on('disconnect', () => {
                console.log("user disconnected");
            });
        });
    }
    res.end();
};

export default SocketHandler;
