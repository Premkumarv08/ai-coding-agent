from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[Message]

class ChatResponse(BaseModel):
    message: str
    codeArtifacts: Optional[List[dict]] = None

class StreamingChunk(BaseModel):
    type: str
    data: str
    language: Optional[str] = None
    filename: Optional[str] = None
