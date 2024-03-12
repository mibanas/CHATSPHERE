import React, { useState, useEffect } from 'react';

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
    room: Room['_id'];
    user: User['_id'];
    timestamp: Date;
}

interface MessageProps {
    socket: any; // Remplacez 'any' par le type approprié de votre socket
    room: Room | null;
    user: User | null;
}

const Message: React.FC<MessageProps> = ({ socket, room, user : User }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Écouter les messages entrants
        socket.on('receive_message', (data: Message) => {
            setMessages([...messages, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, messages]);

    const sendMessage = () => {
        // Envoyer un message via le socket
        socket.emit('send_message', { content: 'Votre message', room: room?._id, user :  user?._id });
    };

    return (
        <div className="flex-1 bg-white flex flex-col">
            <div className="flex-1 overflow-auto p-6">
                <ul className="space-y-2">
                    {messages.map((message) => (
                        <li
                            key={message._id}
                            className={`flex justify-${message.user === 'YOU_USER_ID' ? 'end' : 'start'}`}
                        >
                            <div
                                className={`max-w-xl px-4 py-2 text-gray-700 ${
                                    message.user === 'YOU_USER_ID' ? 'bg-gray-100 rounded' : 'rounded shadow'
                                }`}
                            >
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
                    required
                />

                <button type="submit" onClick={sendMessage}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Message;
