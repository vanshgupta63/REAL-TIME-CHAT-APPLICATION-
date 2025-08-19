import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";


const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [darkMode, setDarkMode] = useState(false);


  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", { message });
    setChat([...chat, { message, self: true }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, { message: data.message, self: false }]);
    });
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        💬 Real-Time Chat App
      </h1>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {chat.map((item, index) => (
            <div
              key={index}
              className={`p-2 rounded-md text-white w-fit ${
                item.self ? "bg-blue-500 ml-auto" : "bg-green-500"
              }`}
            >
              {item.message}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
           onClick={() => setDarkMode(!darkMode)}
           className="p-2 m-2 bg-gray-300 rounded dark:bg-gray-700"
           >
            Toggle Dark Mode
          </button>

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;