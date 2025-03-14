import json
from typing import Dict

async def broadcast_message(chat_id: int, message: Dict):
    """Send messages to all clients in the chat room."""
    from sockets.chat_ws import active_connections  # Avoid circular import

    if chat_id in active_connections:
        for connection in active_connections[chat_id]:
            await connection.send_text(json.dumps(message))
