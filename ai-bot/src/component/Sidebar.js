import React from "react";
import { FaPlus } from "react-icons/fa6";


const Sidebar = (props) => {
  const { allChats, chatId, setChatId, setIsAddChat } = props;
  console.log(allChats)
  return (
      <nav className="text-left overyflow-y bg-[#F8FFFF] shadow-md border-r h-screen  min-w-[250px] py-6 px-4 overflow-auto">
        <button 
          type="button" 
          onClick={() => setIsAddChat()}
          className="text-white my-10 flex gap-2 align-middle justify-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
        >
          <FaPlus className="" style={{ marginTop: '2px',  }} />
          <span>New Chat</span>
        </button>

        <p className="text-xl font-bold my-6  text-left ">Recents Chats</p>
        <ul>
          {allChats?.map((val) => (
            <li key={val.id}>
              <span 
                className="text-slate-700 mb-2 text-left font-medium text-[14px] block hover:text-white hover:bg-[#22808D] rounded-2xl px-4 py-2 transition-all cursor-pointer"
                style={val.id === chatId ? { backgroundColor: "#22808D", color: 'white'} : {} }
                onClick={() =>  setChatId(val.id)}
              >
                {val?.title}
              </span>
            </li>))}
        </ul>

    </nav>
  )
}

export default Sidebar;