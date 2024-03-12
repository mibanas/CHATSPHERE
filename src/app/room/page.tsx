'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface RoomData {
  _id: string;
  name: string;
  users: string[]; // Assuming users is an array of strings
  __v: number;
}

const Room = () => {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [joinRoom, setJoinRoom] = useState(true);
  const [roomList, setRoomList] = useState<RoomData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/rooms');
        const data: { rooms: RoomData[] } = await response.json();
        setRoomList(data.rooms);
      } catch (error) {
        console.error('Error fetching room list:', error);
      }
    };

    fetchData();
  }, [joinRoom]);

  const addRoom = async () => {
    try {
      if (roomName.trim() !== '') {
        const response = await fetch('http://localhost:3002/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: roomName }),
        });
        if (!response.ok) {
          throw new Error('Failed to add room');
        }
        setRoomName('');
        setJoinRoom(true);
      }
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <>
      {joinRoom && (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
            <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Join a Room Chat!</h1>

            <div className="mb-4">
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User
              </label>
              <input
                type="text"
                id="user"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="User Name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room
              </label>
              <select
                id="room"
                value={roomName}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setRoomName(event.target.value)}
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Select a room</option>
                {Array.isArray(roomList) &&
                  roomList.map((room) => (
                    <option key={room._id} value={room.name}>
                      {room.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Link
                href={`/chat?username=${name}&room=${roomName}`}
                // className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
              Join
            </Link>
            </button>
            <button
              onClick={() => setJoinRoom(false)}
              className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Room
            </button>
          </div>
        </div>
      )}

      {!joinRoom && (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
            <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Add Room Chat!</h1>

            <div className="mb-4">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Name :
              </label>
              <input
                type="text"
                id="room"
                value={roomName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoomName(event.target.value)}
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add room name"
                required
              />
            </div>

            <button
              onClick={addRoom}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Room
            </button>

            <button
              onClick={() => setJoinRoom(true)}
              className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
