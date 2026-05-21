"""Backend tests for VELVENYA waitlist API."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fallback from frontend/.env if not exported
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Root endpoint =====
class TestRoot:
    def test_root_welcome_message(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "VELVENYA" in data["message"]


# ===== POST /api/waitlist =====
class TestWaitlistCreate:
    def test_create_valid_email(self, session):
        email = f"TEST_user_{uuid.uuid4().hex[:8]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["email"] == email.lower()
        assert "created_at" in data
        assert "message" in data
        assert "Welcome" in data["message"] or "VELVENYA" in data["message"]

    def test_create_invalid_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={"email": "not-an-email"})
        assert r.status_code == 422, r.text
        data = r.json()
        assert "detail" in data

    def test_create_missing_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={})
        assert r.status_code == 422

    def test_duplicate_email_idempotent(self, session):
        email = f"TEST_dup_{uuid.uuid4().hex[:8]}@example.com"
        r1 = session.post(f"{API}/waitlist", json={"email": email})
        assert r1.status_code == 200
        first = r1.json()

        r2 = session.post(f"{API}/waitlist", json={"email": email})
        assert r2.status_code == 200
        second = r2.json()

        assert second["id"] == first["id"], "Duplicate email should return same id"
        assert second["email"] == first["email"]
        assert "already" in second["message"].lower()

    def test_email_case_insensitive(self, session):
        rand = uuid.uuid4().hex[:8]
        upper = f"TEST_Case_{rand}@Example.COM"
        lower = upper.lower()
        r1 = session.post(f"{API}/waitlist", json={"email": upper})
        assert r1.status_code == 200
        r2 = session.post(f"{API}/waitlist", json={"email": lower})
        assert r2.status_code == 200
        assert r1.json()["id"] == r2.json()["id"]
        assert r2.json()["email"] == lower


# ===== GET /api/waitlist =====
class TestWaitlistList:
    def test_list_returns_array_no_objectid(self, session):
        # Seed an entry first
        email = f"TEST_list_{uuid.uuid4().hex[:8]}@example.com"
        cr = session.post(f"{API}/waitlist", json={"email": email})
        assert cr.status_code == 200

        r = session.get(f"{API}/waitlist")
        assert r.status_code == 200, r.text
        entries = r.json()
        assert isinstance(entries, list)
        assert len(entries) >= 1
        for e in entries:
            assert "_id" not in e, "MongoDB _id must be excluded"
            assert "id" in e
            assert "email" in e
            assert "created_at" in e
        # Most recent first - the just-created one should be in list
        emails = [e["email"] for e in entries]
        assert email.lower() in emails

    def test_list_sorted_recent_first(self, session):
        # Create two entries and verify ordering
        e1 = f"TEST_order1_{uuid.uuid4().hex[:8]}@example.com"
        e2 = f"TEST_order2_{uuid.uuid4().hex[:8]}@example.com"
        session.post(f"{API}/waitlist", json={"email": e1})
        session.post(f"{API}/waitlist", json={"email": e2})

        r = session.get(f"{API}/waitlist")
        assert r.status_code == 200
        entries = r.json()
        # Find positions
        emails_order = [e["email"] for e in entries]
        assert e2.lower() in emails_order
        assert e1.lower() in emails_order
        assert emails_order.index(e2.lower()) < emails_order.index(e1.lower()), \
            "Most recent (e2) should appear before e1"


# ===== GET /api/waitlist/count =====
class TestWaitlistCount:
    def test_count_returns_number(self, session):
        r = session.get(f"{API}/waitlist/count")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 0

    def test_count_increases_after_create(self, session):
        before = session.get(f"{API}/waitlist/count").json()["count"]
        email = f"TEST_count_{uuid.uuid4().hex[:8]}@example.com"
        session.post(f"{API}/waitlist", json={"email": email})
        after = session.get(f"{API}/waitlist/count").json()["count"]
        assert after == before + 1, f"Count should increase by 1: before={before}, after={after}"

    def test_count_unchanged_for_duplicate(self, session):
        email = f"TEST_countdup_{uuid.uuid4().hex[:8]}@example.com"
        session.post(f"{API}/waitlist", json={"email": email})
        before = session.get(f"{API}/waitlist/count").json()["count"]
        session.post(f"{API}/waitlist", json={"email": email})
        after = session.get(f"{API}/waitlist/count").json()["count"]
        assert after == before, "Duplicate should not increase count"
