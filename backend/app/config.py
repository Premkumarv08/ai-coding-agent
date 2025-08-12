from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    ALLOWED_ORIGINS: str | List[str] = ["http://localhost:5173", "http://localhost:3000"]
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        case_sensitive = True

settings = Settings()