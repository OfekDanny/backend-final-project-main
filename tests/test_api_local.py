import pytest
import requests
import os
from datetime import date

# 4 process URLs — set via environment variables
LOGS_URL   = os.environ.get("LOGS_URL",   "http://localhost:3001")  # process-logs  (a)
USERS_URL  = os.environ.get("USERS_URL",  "http://localhost:3002")  # process-users (b)
COSTS_URL  = os.environ.get("COSTS_URL",  "http://localhost:3003")  # process-costs (c)
ABOUT_URL  = os.environ.get("ABOUT_URL",  "http://localhost:3004")  # process-about (d)

today = date.today()
CATEGORIES = ["food", "health", "housing", "sports", "education"]

test_user = {
    "id": 999999,
    "first_name": "test",
    "last_name": "user",
    "birthday": "1995-06-15",
}

cost_data = {
    "userid": 123123,
    "description": "milk 9",
    "category": "food",
    "sum": 8,
    "day": today.day,
    "month": today.month,
    "year": today.year,
}


# ---------------------------------------------------------------------------
# process-about (d)
# ---------------------------------------------------------------------------

def test_about():
    response = requests.get(f"{ABOUT_URL}/api/about/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    for member in data:
        assert "first_name" in member
        assert "last_name" in member
        assert "id" not in member
        assert "email" not in member


# ---------------------------------------------------------------------------
# process-costs (c)
# ---------------------------------------------------------------------------

def test_get_report_empty():
    url = f"{COSTS_URL}/api/report/?id=123123&year={today.year}&month={today.month}"
    response = requests.get(url)
    assert response.status_code == 200
    body = response.json()
    assert body["userid"] == 123123
    assert body["year"] == today.year
    assert body["month"] == today.month
    assert isinstance(body["costs"], list)
    assert len(body["costs"]) == 5
    category_keys = [list(item.keys())[0] for item in body["costs"]]
    for cat in CATEGORIES:
        assert cat in category_keys


def test_add_cost():
    response = requests.post(f"{COSTS_URL}/api/add/", json=cost_data)
    assert response.status_code == 201
    expense = response.json()
    assert "id" in expense
    assert expense["userid"] == cost_data["userid"]
    assert expense["description"] == cost_data["description"]
    assert expense["category"] == cost_data["category"]
    assert expense["sum"] == cost_data["sum"]
    assert expense["day"] == cost_data["day"]
    assert expense["month"] == cost_data["month"]
    assert expense["year"] == cost_data["year"]


def test_get_report_with_cost():
    url = f"{COSTS_URL}/api/report/?id=123123&year={today.year}&month={today.month}"
    response = requests.get(url)
    assert response.status_code == 200
    body = response.json()
    food_obj = next(item for item in body["costs"] if "food" in item)
    food_items = food_obj["food"]
    descriptions = [e["description"] for e in food_items]
    assert cost_data["description"] in descriptions


def test_invalid_category():
    bad = {**cost_data, "category": "invalid_category"}
    response = requests.post(f"{COSTS_URL}/api/add/", json=bad)
    assert response.status_code == 400
    body = response.json()
    assert "id" in body
    assert "message" in body


def test_invalid_user():
    bad = {**cost_data, "userid": 999888777}
    response = requests.post(f"{COSTS_URL}/api/add/", json=bad)
    assert response.status_code == 400


def test_missing_fields():
    bad = {"userid": 123123, "category": "food", "description": "no sum"}
    response = requests.post(f"{COSTS_URL}/api/add/", json=bad)
    assert response.status_code == 400


def test_past_date():
    bad = {**cost_data, "day": 1, "month": 1, "year": 2020}
    response = requests.post(f"{COSTS_URL}/api/add/", json=bad)
    assert response.status_code == 400


# ---------------------------------------------------------------------------
# process-users (b)
# ---------------------------------------------------------------------------

def test_add_user():
    response = requests.post(f"{USERS_URL}/api/add/", json=test_user)
    assert response.status_code == 201
    user = response.json()
    assert user["id"] == test_user["id"]
    assert user["first_name"] == test_user["first_name"]
    assert user["last_name"] == test_user["last_name"]


def test_get_users():
    response = requests.get(f"{USERS_URL}/api/users")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) > 0


def test_get_user_by_id():
    response = requests.get(f"{USERS_URL}/api/users/123123")
    assert response.status_code == 200
    user = response.json()
    assert user["id"] == 123123
    assert "first_name" in user
    assert "last_name" in user
    assert "total" in user


def test_get_user_not_found():
    response = requests.get(f"{USERS_URL}/api/users/000000")
    assert response.status_code == 404
    body = response.json()
    assert "id" in body
    assert "message" in body


# ---------------------------------------------------------------------------
# process-logs (a)
# ---------------------------------------------------------------------------

def test_get_logs():
    response = requests.get(f"{LOGS_URL}/api/logs")
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)
