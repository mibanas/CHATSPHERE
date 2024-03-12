const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const serverIo = require('socket.io');
const connect = require('./config/db');
const { createMessage, getAllMessages, checkUserInRoom } = require('./controllers/roomController')


connect();
dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json())
const port = process.env.PORT || 3010;
const server = http.createServer(app);
const routes = require('./routes/routes');

const io = serverIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

 

io.on('connection', socket => {
    console.log("🚀 ~ io.on ~ socket: New WS Connection ....");

    socket.on('join', async ({ room: roomName, user: username }, callback) => {
        try {
            const { selectRoom, selectUser, error } = await checkUserInRoom(roomName, username)            
            const messages = await getAllMessages(selectRoom._id)
            // const messages = 'sanabimohamed'
            
            if (error) {
                console.log("🚀 ~ socket.on ~ errorrrrr:", error)
                return callback({ error });
            } else {
                console.log("🚀 ~ socket.on ~ NoErrorrrrrr ... ")
                socket.join(selectRoom);
                callback(selectRoom, messages , error)
            }
        } catch (error) {
            callback({ error: error.message });
        }
    });

    socket.on('send_message', async ({ content, room, user }) => {
        console.log("🚀 ~ socket.on ~ roomllllllllll:", room)
        try {
            // Créer un nouveau message
            const newMessage = await createMessage(content, room, user);
            console.log("🚀 ~ socket.on ~ newMessageeeeeeeeeeeeeee:", newMessage)
            
            // const messages = await getAllMessages(selectRoom._id)
            
            // Diffuser le message à tous les clients dans la même salle
            io.emit('receive_message', newMessage);
        } catch (error) {
            console.error('Error sending message:', error.message);
        }   
    });

    
    socket.on('disconnect', () => {
        console.log("🚀 ~ socket.on ~ User Had left ...:");
    });
});

app.use(routes);

server.listen(port, () => {
    console.log(`SERVER RUNNING AT PORT ${port}`);
});
