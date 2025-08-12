from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
import json
from typing import AsyncGenerator
from ..models import ChatRequest
from ..services.gemini_service import GeminiService
from ..config import settings

router = APIRouter()

gemini_service = GeminiService(settings.GEMINI_API_KEY)

@router.post("/chat")
async def chat(request: ChatRequest):
    """Non-streaming chat endpoint"""
    try:
        history = [{"role": msg.role, "content": msg.content} for msg in request.conversationHistory]
        
        response_chunks = []
        async for chunk in gemini_service.stream_response(request.message, history):
            response_chunks.append(chunk)
        
        content = ""
        for chunk in response_chunks:
            if chunk.type == "content":
                content += chunk.data
        
        return {"message": content}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint using Server-Sent Events"""
    try:
        history = [{"role": msg.role, "content": msg.content} for msg in request.conversationHistory]
        
        async def generate_stream() -> AsyncGenerator[dict, None]:
            async for chunk in gemini_service.stream_response(request.message, history):
                yield {
                    "event": "message",
                    "data": json.dumps({
                        "type": chunk.type,
                        "data": chunk.data,
                        "language": chunk.language,
                        "filename": chunk.filename
                    })
                }
        
        return EventSourceResponse(generate_stream())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Coding Agent Backend"}
