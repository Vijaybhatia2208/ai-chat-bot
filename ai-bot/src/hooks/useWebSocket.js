import { useEffect, useRef, useState } from "react";

const useWebSocket = (chatId, setChatMessages) => {
  const [displayedMessage, setDisplayedMessage] = useState(""); // For typing effect
  const socketRef = useRef(null);
  const typingQueueRef = useRef([]); // Queue for incoming WebSocket messages
  const isTypingRef = useRef(false); // Flag to track if typing is in progress

  // WebSocket connection and message handling
  useEffect(() => {
    if (chatId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}`);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        console.log("Received WebSocket message:", newMessage);

        if (newMessage.type === "user") {
          // Directly append user messages
          setChatMessages((prev) => [...prev, newMessage]);
        } else if (newMessage.type === "ai") {
          // Queue AI messages for typing effect
          typingQueueRef.current.push(newMessage.message);
          processTypingQueue();
        }
      };

      return () => {
        ws.close(); // Clean up WebSocket on unmount
      };
    }
  }, [chatId, setChatMessages]);

  // Process the typing queue for AI messages
  const processTypingQueue = () => {
    if (isTypingRef.current || typingQueueRef.current.length === 0) return;

    const messageToType = typingQueueRef.current.shift(); // Get the next message
    let currentText = "";
    let index = 0;

    isTypingRef.current = true;

    const typingInterval = setInterval(() => {
      if (index < messageToType.length) {
        currentText += messageToType[index];
        setDisplayedMessage(currentText);
        index++;
      } else {
        // Typing complete for this message
        clearInterval(typingInterval);
        setChatMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.type === "ai") {
            // Append to the last AI message
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, message: lastMessage.message + messageToType },
            ];
          }
          return [...prev, { type: "ai", message: messageToType, time_stamp: new Date().toISOString() }];
        });
        setDisplayedMessage(""); // Clear the typing display
        isTypingRef.current = false;
        processTypingQueue(); // Process next message in queue
      }
    }, 50); // Adjust speed of typing (50ms per character)
  };

  // Function to send a message via WebSocket
  const sendMessage = (message) => {
    if (message.trim() !== "" && socketRef.current) {
      const userMessage = {
        type: "user",
        message: message,
        time_stamp: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(userMessage));
      setChatMessages((prev) => [...prev, userMessage]); // Add user message immediately
    }
  };

  return { displayedMessage, sendMessage };
};

export default useWebSocket;