const { User, ChatRoom, Message } = require('../models/roomModel')


// Créer une nouvelle salle
exports.createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const existingRoom = await ChatRoom.findOne({ name });

    if (existingRoom) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    const newRoom = await ChatRoom.create({ name });
    
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.checkUserInRoom = async (room, user) => {
  try {
        // Vérifier si la salle de chat existe
        let selectRoom = await ChatRoom.findOne({ name: room });
        if (!selectRoom) {
           throw new Error('Room does not exist');
        }
  
        // Vérifier si l'utilisateur existe
        let selectUser = await User.findOne({ username: user });
        if (!selectUser) {
           // Si l'utilisateur n'existe pas, le créer
           selectUser = await User.create({ username: user });
           if (!selectUser) {
              throw new Error('Could not create user');
           }
        }
  
        // Vérifier si l'utilisateur est dans la salle de chat
        let userInRoom = selectRoom.users.includes(selectUser._id);
  
        if (!userInRoom) {
           // Ajouter l'utilisateur à la salle de chat
           await ChatRoom.findByIdAndUpdate(selectRoom._id, { $push: { users: selectUser._id } });
           // Mettre à jour la variable room pour inclure le nouvel utilisateur
           selectRoom = await ChatRoom.findById(selectRoom._id).populate('users');
           return { selectRoom, selectUser };
        }  
        selectRoom = await ChatRoom.findById(selectRoom._id).populate('users');
        return { selectRoom, selectUser };
     } catch (error) {
        return { error: error.message };
    }
  }
  
  


// Obtenir la liste des salles
exports.getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new message
exports.createMessage = async (content, roomId, userId) => {
   try {
       // Vérifier si l'utilisateur et la salle existent
       const user = await User.findOne({ username: userId });
       const room = await ChatRoom.findOne({ name: roomId });
       if (!user) {
           throw new Error('User not found');
       }
       if (!room) {
           throw new Error('Room not found');
       }

       // Créer un nouveau message
       const newMessage = await Message.create({ content, room: room._id, user: user._id });
       console.log("🚀 ~ exports.createMessage= ~ newMessage:", newMessage)
       return newMessage;
   } catch (error) {
       throw new Error(error.message);
   }
};



// Get all messages
exports.getAllMessages = async (roomId) => {
   console.log("🚀 ~ exports.getAllMessages= ~ roomId:", roomId);

   try {
      const messages = await Message.find({ room: roomId }).populate('user');

      return messages;
   } catch (error) {
      throw new Error(error.message);
   }
};

