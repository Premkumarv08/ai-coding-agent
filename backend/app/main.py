from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.chat import router as chat_router
from .config import settings

# Create FastAPI app
app = FastAPI(
    title="AI Coding Agent API",
    description="Backend API for AI Coding Agent with Gemini 2.5 integration",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(chat_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "message": "AI Coding Agent Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    try:
        
        return {
            "status": "healthy",
            "service": "AI Coding Agent Backend",
            "gemini_api_key": settings.GEMINI_API_KEY,
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "AI Coding Agent Backend",
            "error": str(e),
            "gemini_api_key_configured": False
        }
