from fastapi import APIRouter
from database import load_data
from config import CHATS_FILE, MESSAGES_FILE
import json
import uuid
import datetime
from pydantic import BaseModel
import random

router = APIRouter()

class ChatCreateRequest(BaseModel):
    chat_name: str  # Ensuring correct request body format


def generate_unique_chat_id(chats):
    """Generate a unique random integer ID."""
    existing_ids = {chat["id"] for chat in chats}
    while True:
        new_id = random.randint(1000, 9999)  # Generate 4-digit random ID
        if new_id not in existing_ids:
            return new_id

def save_data(filename: str, data):
    """Save data to a JSON file."""
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

@router.get("/chats")
async def get_all_chats():
    """Retrieve a list of all chats."""
    return load_data(CHATS_FILE)

@router.get("/chats/{chat_id}")
async def get_chat(chat_id: str):
    """Retrieve a specific chat by ID along with its messages."""
    messages = load_data(MESSAGES_FILE)
    return [msg for msg in messages if msg["chat_id"] == chat_id] or []


@router.post("/chats")
async def create_chat(chat: ChatCreateRequest):  
    """Create a new chat with a unique UUID."""
    chats = load_data(CHATS_FILE)
    
    # Convert Pydantic model to dictionary
    new_chat = {
        "id": str(uuid.uuid4()),  # Generate a unique chat ID
        "title": chat.chat_name,  # Extract chat_name from request body
        "created_at" : str(datetime.datetime.now())
    }
    
    chats.append(new_chat)
    save_data(CHATS_FILE, chats)  # ✅ Now it's JSON serializable
    
    return {"message": "Chat created successfully", "chat": new_chat}
