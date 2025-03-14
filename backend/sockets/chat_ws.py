import json
import datetime
import asyncio
import uuid
from fastapi import WebSocket, WebSocketDisconnect
from database import load_data, save_data
from utils.broadcast import broadcast_message
from config import MESSAGES_FILE

active_connections = {}  # Store active WebSocket connections by chat_id

async def websocket_chat(websocket: WebSocket, chat_id: str):
    """Handle WebSocket connections for real-time messaging."""
    await websocket.accept()
    
    if chat_id not in active_connections:
        active_connections[chat_id] = set()
    active_connections[chat_id].add(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            user_message = {
                "id": str(uuid.uuid4()),
                "chat_id": chat_id,
                "type": "user",
                "message": data,
                "time_stamp": str(datetime.datetime.now()),
            }

            messages = load_data(MESSAGES_FILE)
            messages.append(user_message)
            save_data(MESSAGES_FILE, messages)
            
            await broadcast_message(chat_id, user_message)

            # Simulate AI response streaming in chunks
            full_response = """
                Vijay Bhatia is a results-driven Full Stack Developer with over 1.5 year of professional experience, specializing in MERN stack (MongoDB, Express.js, React.js, Node.js) and Django frameworks. 
                Passionate about building scalable, high-performance web applications, he excels in frontend and backend development, RESTful APIs, and modern UI/UX design.
                His expertise includes React.js, Next.js, Redux Toolkit, Material UI, Tailwind and TypeScript on the frontend, while he leverages Node.js, Django, and PostgreSQL for backend solutions. 
            """.strip()

            ai_message_id = str(uuid.uuid4())
            ai_message = {
                "id": ai_message_id,
                "chat_id": chat_id,
                "type": "ai",
                "message": "",
                "time_stamp": str(datetime.datetime.now()),
            }

            messages.append(ai_message)
            save_data(MESSAGES_FILE, messages)

            all_message = ""
            for i in range(0, len(full_response), 10):
                chunk = full_response[i : i + 10]
                ai_message["message"] = chunk
                all_message += chunk
                await broadcast_message(chat_id, ai_message)
                await asyncio.sleep(0.2)

            ai_message["message"] = all_message
            messages = load_data(MESSAGES_FILE)
            for msg in messages:
                if msg["id"] == ai_message_id:
                    msg["message"] = ai_message["message"]
                    break
            save_data(MESSAGES_FILE, messages)

    except WebSocketDisconnect:
        print(f"Client disconnected from chat {chat_id}")
        active_connections[chat_id].remove(websocket)
        if not active_connections[chat_id]:  
            del active_connections[chat_id]
