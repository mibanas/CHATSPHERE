const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
});

const roomSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const ChatRoom = mongoose.model('ChatRoom', roomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, ChatRoom, Message };
