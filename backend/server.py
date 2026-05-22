from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone 
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
resend.api_key = os.environ["RESEND_API_KEY"]
# Create the main app without a prefix
app = FastAPI(title="VELVENYA API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ===================== Models =====================
class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WaitlistCreate(BaseModel):
    email: EmailStr


class WaitlistResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime
    message: str


# ===================== Routes =====================
@api_router.get("/")
async def root():
    return {"message": "VELVENYA — Silence is the oldest luxury."}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate):
    email = payload.email.lower().strip()

    # Prevent duplicates
    existing = await db.waitlist.find_one({"email": email}, {"_id": 0})
    if existing:
        return WaitlistResponse(
            id=existing["id"],
            email=existing["email"],
            created_at=datetime.fromisoformat(existing["created_at"]) if isinstance(existing["created_at"], str) else existing["created_at"],
            message="You're already on the list. Thank you for your patience.",
        )

    entry = WaitlistEntry(email=email)
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["email"] = str(doc["email"])

        await db.waitlist.insert_one(doc)

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": "velvenyapvtltd@gmail.com",
            "subject": "New Velvenya Waitlist Signup",
            "html": f"""
            <h2>New Waitlist Signup</h2>
            <p>Email: {email}</p>
            """
        })
    except Exception as e:
        logger.error(f"Resend email failed: {str(e)}")

    return WaitlistResponse(
        id=entry.id,
        email=entry.email,
        created_at=entry.created_at,
        message="Welcome to VELVENYA. You will be the first to know.",
    )


@api_router.get("/waitlist", response_model=List[WaitlistEntry])
async def list_waitlist():
    entries = await db.waitlist.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for e in entries:
        if isinstance(e.get("created_at"), str):
            e["created_at"] = datetime.fromisoformat(e["created_at"])
    return entries


@api_router.get("/waitlist/count")
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
