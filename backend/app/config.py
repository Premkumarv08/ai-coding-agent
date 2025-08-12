from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    GEMINI_API_KEY: str = "AIzaSyCpLb62Ine3mTn6-7_0XgnvZft7oL3ZYVo"
    ALLOWED_ORIGINS: str | List[str] = ["http://localhost:5173", "http://localhost:3000"]
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        case_sensitive = True

settings = Settings()

# Debug: Print the loaded settings
print("Loaded GEMINI_API_KEY:", settings.GEMINI_API_KEY)
print("From os.environ GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))
