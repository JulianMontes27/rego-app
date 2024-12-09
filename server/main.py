from fastapi import FastAPI, UploadFile, File, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection string
CONNECTION_STRING = os.environ["MONGODB_URI"]
client = AsyncIOMotorClient(CONNECTION_STRING)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Starting FastAPI server...")

# Create the API instance
app = FastAPI(
    title="Rego AI API",
    description="API for farm management and crop disease detection",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS").split(","),  # Add frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth helper to authenticate the user request
def get_session_token_from_cookie(request: Request):
    cookies = request.cookies
    session_token = cookies.get("authjs.session-token")  # Cookie name in Auth.js
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No session token found in cookies"
        )
    return session_token

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Farm AI API is running"}

# Image processing endpoint
@app.post("/process-image/")
async def process_image(user_id: str = "", file: UploadFile = File(...)):
    # Process image with AI model
    result = {"prediction": "Disease Found"}

    # Return the result to Next.js
    return {"status": "success", "result": result}

# Get the server port
port = int(os.getenv("API_PORT", 8000))  # Default to port 8000

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
