# Imports:
from pydantic_settings import BaseSettings, SettingsConfigDict

# Config Database
class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./database.db"
    # Env e encode
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
