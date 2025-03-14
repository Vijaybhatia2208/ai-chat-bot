import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as URLS from "../apiUrls";
import { IoIosSend } from "react-icons/io";
import { format } from "date-fns";

const ChatSection = (props) => {
  const { chatId, title } = props;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);

  // Load initial chat messages
  useEffect(() => {
    if (chatId) {
      axios
        .get(URLS.GET_CHAT.replace("{}", chatId), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setChatMessages(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [chatId]);

  // WebSocket connection
  useEffect(() => {
    if (chatId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}`);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        console.log(newMessage);
        setChatMessages((prev) => {
          if (prev.length === 0) {
            return [newMessage]; // If no previous messages, add new
          }

          const lastMessageIndex = prev.length - 1;
          const lastMessage = prev[lastMessageIndex];

          if (newMessage.type === "user") {
            return [...prev, newMessage];
          } else if (lastMessage?.type === "ai") {
            // Append to last AI message
            const updatedMessages = [...prev];
            updatedMessages[lastMessageIndex] = {
              ...lastMessage,
              message: lastMessage.message + newMessage.message, // Append streamed data
            };
            return updatedMessages;
          }

          // Otherwise, add new message
          return [...prev, newMessage];
        });
      };

      // Cleanup WebSocket on unmount
      return () => {
        ws.close();
      };
    }
  }, [chatId]);

  // Scroll to bottom when chatMessages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    console.log("chatMessages", chatMessages);
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim() !== "" && socketRef.current) {
      socketRef.current.send(message);
      // setChatMessages((prev) => [
      //   ...prev,
      //   { type: "user", message: message, time_stamp: new Date().toISOString() },
      // ]);
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white p-4 text-gray-700 h-[10%] flex items-center shadow-xl border-b border-gray-100">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-white" ref={chatContainerRef}>
        {chatMessages.map((val, index) =>
          val.type === "ai" ? (
            <div className="flex gap-2 justify-start mb-4 cursor-pointer" key={index}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <img
                  src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div>
                <div className="text-sm flex max-w-[90%] bg-white rounded-2xl p-3">
                  <p className="text-gray-700">{val.message}</p>
                </div>
                {val?.time_stamp && (
                  <span className="text-xs pl-4 text-gray-500 mt-1 self-end">
                    {format(new Date(val.time_stamp), "hh:mm a, d MMM yyyy")}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-end mb-4 cursor-pointer" key={index}>
              <div>
                <div className="text-sm flex max-w-[90%] bg-indigo-500 text-white rounded-3xl py-3 pl-4 shadow">
                  <p className="px-4">{val.message}</p>
                </div>
                {val?.time_stamp && (
                  <span className="text-xs pl-4 text-gray-500 mt-1 self-end">
                    {format(new Date(val.time_stamp), "hh:mm a, d MMM yyyy")}
                  </span>
                )}
              </div>
              {/* <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
              </div> */}
            </div>
          )
        )}
      </div>

      <footer className="border-t h-[15%] rounded-xl bg-white mx-16 border-gray-100 shadow-xl p-4 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message..."
          className="w-full p-3 rounded-md focus:ring-blue-500"
        />
        <button
          className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-4 py-4 rounded-md ml-2"
          onClick={handleSend}
        >
          <IoIosSend className="text-xl" />
        </button>
      </footer>
    </div>
  );
};

export default ChatSection;