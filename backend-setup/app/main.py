from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import predict, poses, videos, chatbot

# No table/schema creation needed — MongoDB collections are created
# automatically the first time a document is inserted into them.

app = FastAPI(title="Yoga & Wellness API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(poses.router)
app.include_router(videos.router)
app.include_router(chatbot.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
