  import { useEffect, useState } from 'react';
  import './App.css';
  import Sidebar from './component/Sidebar';
  import axios from 'axios';
  import * as URLS from "./apiUrls";
  import ChatSection from './component/ChatSection';
  import AddChatModal from './component/AddChatModal';

  function App() {
    const [allChats , setAllChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [chatTitle, setChatTitle] = useState("");
    const [isAddChat, setIsAddChat] = useState(false);

    useEffect(() => {
      axios.get(
        URLS.CHATS, {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        setAllChats(res.data);
        if(res.data && Array.isArray(res.data) && res.data.length > 0) {
          setChatTitle(res.data[0].title)
          setChatId(res.data[0].id)
        }
      })
      .catch((err) =>  console.log(err));
    }, []);

  const handleCreateChat = (newChat) =>  {
    setAllChats((prev) => [...prev, newChat]);
    setChatId(newChat?.id);
    setIsAddChat(false);
  }

  const handleClick = () => {
    console.log("clicked.. ")
  }

  return (
    <div className="grid grid-cols-5">
      <div className='col-span-1'>
        <Sidebar 
          allChats={allChats} 
          handleClick={handleClick}
          chatId={chatId}
          setChatId={(id) =>  setChatId(id)}
          setIsAddChat={() => setIsAddChat(!isAddChat)}
        />
      </div>
      <div className='col-span-4'>
        <ChatSection 
          title={chatTitle}
          chatId={chatId}
        />
      </div>
      <AddChatModal 
        isOpen={isAddChat}
        onClose={() => setIsAddChat(false)}
        handleCreate={(newChat) => handleCreateChat(newChat)}
      />
    </div>
  );
  }

  export default App;
