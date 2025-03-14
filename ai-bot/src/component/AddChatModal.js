import React, { useState } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import * as URLS from "../apiUrls";

const AddChatModal = (props) => {
  const { onClose, isOpen, handleCreate } = props;
  const [chatName, setChatName] = useState("");
  const handleClick = () => {
    axios.post(URLS.CHATS, 
      { chat_name: chatName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      console.log(response.data.chat);
      handleCreate(response.data?.chat);
      onClose();
    }).catch((err) => console.log(err));
  }

  return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-20 relative w-full"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <button
      className="absolute top-4 right-4 rounded-full bg-gray-200 p-2 text-gray-500 hover:text-gray-700"
      onClick={onClose}
    >
      <AiOutlineClose size={16} />
    </button>
    <h2 className="text-xl font-semibold mb-4">Create a Chat</h2>
    <input
      type="text"
      placeholder="Enter chat name"
      value={chatName}
      onChange={(e) => setChatName(e.target.value)}
      className="w-[400px] my-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex justify-end mt-4">
      <button
        className="bg-pink-500 text-white px-6 py-2 rounded-3xl font-medium  hover:bg-pink-600"
        onClick={() => handleClick()}
      >
        Create
      </button>
    </div>
  </Modal>
  )
}

export default AddChatModal;