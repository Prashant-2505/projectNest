'use client'
import { Server } from "socket.io";

const SocketHandler = (req, res) => {
    console.log("called api")
    if (res.socket.server.io) {
        console.log("socket already running")
    } else {
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', (socket) => {
            console.log("server is connected")

            socket.on('user-leave', (koko) => {
                console.log("user gone", koko)
            })



            // logged in user join socket room
            socket.on('setup', (userData) => {
                console.log("setup done")
                socket.join(userData._id)
                socket.emit("connected")
            })


            // the person user want to chat also join socket room
            socket.on('join chat', (room) => {
                socket.join(room)
                console.log("user joined " + room)
            })



            // get message from socket server
            socket.on('new message', (newMessageRecieved) => {
                var chat = newMessageRecieved.chat
                if (!chat.users) {
                    console.log("chat users not defined")
                }
                // if its grp chat chat then send message to all users ecpect one who sending 
                chat.users.forEach(user => {
                    if (user._id == newMessageRecieved.sender._id) return

                    socket.in(user._id).emit("message recieved", newMessageRecieved)
                })
            }
            )


            // socket for typing
            socket.on('typing', (room) => {
                socket.in(room).emit('typing')
            })

            socket.on('stop typing', (room) => {
                socket.in(room).emit('stop typing')
            })



            // turn socket off
            socket.off('setup', () => {
                console.log("user disconnected")
                socket.leave(userData._id)
            })

        })
    }
    res.end();
}


export default SocketHandler;

