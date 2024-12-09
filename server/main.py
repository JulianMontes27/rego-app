from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#create the API instance
app = FastAPI(
    title="Rego AI API",
    description="API for farm management and crop disease detection",
    version="1.0.0"
)

# Configure CORS
#CORSMiddleware helps handle Cross-Origin Resource Sharing (allows web browsers to make requests to our API from different domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/") is a decorator that creates a route for GET requests to the root URL "/"
@app.get("/")
async def root():
    return {"message": "Farm AI API is running"}

@app.get("/hello")
async def hola():
    return {
        "messsage": "Hello world"
    }

# The if __name__ == "__main__": block ensures that the app starts when you execute the script directly.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)