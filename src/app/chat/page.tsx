'use client'



import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Socket, io } from 'socket.io-client';

let socket : Socket

interface User {
  _id: string;
  username: string;
}

interface Room {
  _id: string;
  name: string;
  users: User[];
}

interface Message {
  _id: string;
  content: string;
  room: string;
  user: User;
  timestamp: Date;
}



const Chats = () => {
  const params = useSearchParams()
  const [name, setName] = useState<string | null>('')
  const [room, setRoom] = useState<string | null>('')
  const [roomFromServer, setRoomFromServer] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('');
  console.log("🚀 ~ Chats ~ message:", message)
  

  const ENDPOINT = `http://localhost:3002`

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', {
        content: message.trim(),
        room: roomFromServer?.name,
        user: name
      });
      setMessage('');
    }
  };


  useEffect(()=> {
    const room = params.get('room')
    setRoom(room)
    const user = params.get('username')
    setName(user)

    socket = io(ENDPOINT)
    
    socket.emit('join', { room, user }, (roomFromServer : Room, messages : any, error : any) => {
      console.log("🚀 ~ socket.emit ~ error:", error)
      console.log("🚀 ~ socket.emit ~ messages:", messages)
      console.log("🚀 ~ socket.emit ~ roomFromServer:", roomFromServer)
      
      if (error) {
          alert(error);
      } else {
          // Utilisez la variable roomFromServer pour accéder à la valeur de room envoyée par le serveur
          setRoomFromServer(roomFromServer)
          setMessages(messages)
          console.log("Room from server:", roomFromServer.name);
      }
  });
    
  socket.on('receive_message', (newMessage : any) => {
    console.log("🚀 ~ socket.on ~ hererererere:", newMessage)
    // Mettre à jour l'état des messages avec le nouveau message reçu
    setMessages((prevMessages) => [...prevMessages, newMessage]);
});
    return () => {
      socket.disconnect()
      socket.off()
    }
  }, [ENDPOINT, room, name, socket])


  return (
    // <></>
    <div className="h-screen flex flex-col">
    <div className="flex-1 bg-gray-100 flex">
      <div className="w-1/4 min-w-[20rem] bg-white border-r border-gray-300 flex flex-col">
        <div className="p-3 border-b border-gray-300">
          <input type="search" className="w-full py-2 px-3 bg-gray-100 rounded outline-none" name="search" placeholder="Rechercher" required />
        </div>
        <ul className="flex-1 overflow-auto">

            {roomFromServer && roomFromServer.users.map(user => (
              <li className="border-b border-gray-300" key={user._id}>
                <div className="p-3 flex items-center hover:bg-gray-100 cursor-pointer">
                  <img className="w-10 h-10 rounded-full" src={`https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg`} alt={user.username} />
                  <div className="ml-2 flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">{user.username}</span>
                      <span className="text-sm text-gray-600">25 minutes</span>
                    </div>
                    <span className="text-sm text-gray-600">bye</span>
                  </div>
                </div>
              </li>
            ))}

        </ul>
      </div>
      {/* ddddddddddddddddddddddddddddd */}

      <div className="flex-1 bg-white flex flex-col">
        
        {/* <div className="flex-1 overflow-auto p-6">
          <ul className="space-y-2">

            <li className="flex justify-start">
              <div className="max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                <span className="block">Hi</span>
              </div>
            </li>

            <li className="flex justify-end">
              <div className="max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                <span className="block">Hiiii</span>
              </div>
            </li>
        

          </ul>
        </div> */}

        <div className="flex-1 overflow-auto p-6">
          <ul className="space-y-2">
            {messages.map((message) => (
              <li key={message._id} className={message.user.username === name ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-xl px-4 py-2 text-gray-700 ${message.user.username === name ? 'bg-gray-100' : 'rounded shadow'}`}>
                  <span className="block">{message.content}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>


        <div className="p-3 border-t border-gray-300 flex items-center">
          <input 
            type="text" 
            placeholder="Message" 
            className="flex-1 py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700" 
            name="message" 
            onChange={(e) => setMessage(e.target.value)}
            required />
  
          <button 
            type="submit"
            onClick={sendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ddddddddddddddddddddddddddddd */}

    </div>
  </div>
  
  )
}

export default Chats