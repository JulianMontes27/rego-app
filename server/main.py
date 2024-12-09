from fastapi import FastAPI, Request, HTTPException, status, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import logging
import os

# Load environment variables
load_dotenv()

# MongoDB Connection
CONNECTION_STRING = os.getenv("MONGODB_URI")

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

# Async lifespan to handle MongoDB connection
@asynccontextmanager
async def db_lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(CONNECTION_STRING)
    app.database = app.mongodb_client.get_default_database()
    
    # Test the connection
    try:
        ping_response = await app.database.command("ping")
        if int(ping_response["ok"]) != 1:
            raise Exception("Database ping failed.")
        logger.info("Connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

    yield  # Application is running

    # Shutdown
    app.mongodb_client.close()
    logger.info("Disconnected from MongoDB.")

# Create FastAPI app
app = FastAPI(
    title="Rego AI API",
    description="API for farm management and crop disease detection",
    version="1.0.0",
    lifespan=db_lifespan
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",     "http://127.0.0.1:3000",
],  # Your Next.js app URL
    allow_credentials=True,  # This is crucial for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper: Extract session token from cookies
def get_session_token_from_cookie(request: Request) -> str:
    session_token = request.cookies.get("authjs.session-token")
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token not found in cookies."
        )
    return session_token

# Helper: Validate session and fetch user from MongoDB
async def get_user_from_session(db: AsyncIOMotorDatabase, session_token: str) -> dict:
    session = await db.sessions.find_one({"sessionToken": session_token})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token."
        )
    
    # Optional: Check if session has expired
    user = await db.users.find_one({"_id": session["userId"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with the session not found."
        )
    
    return user

# Dependency: Authenticate user
async def get_authenticated_user(
    request: Request, db: AsyncIOMotorDatabase = Depends(lambda: app.database)
) -> dict:
    session_token = get_session_token_from_cookie(request)
    user = await get_user_from_session(db, session_token)
    return user

# Public Route
@app.get("/")
async def root():
    return {"message": "Farm AI API is running."}

# Secure Route (requires authentication)
@app.get("/secure-data/")
async def secure_data(user: dict = Depends(get_authenticated_user)):
    return {
        "message": "This is a secure endpoint.",
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email")
        }
    }

# Endpoint for AI-related tasks
@app.post("/process-image/")
async def process_image(
    user: dict = Depends(get_authenticated_user), file: UploadFile = File(...)
):
    # Simulated AI processing logic
    logger.info(f"Processing image for user {user.get('email')}.")
    result = {"prediction": "Disease Found"}

    # Return the result to the Next.js app
    return {"status": "success", "result": result}

# Run the server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
