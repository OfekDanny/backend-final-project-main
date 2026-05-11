# Node.js REST API - Expense Tracker

A microservices-based expense tracker built with Node.js, Express, and MongoDB Atlas. The system is split into four independent processes plus a main API gateway.

## Architecture

| Service | Port | Responsibility |
|---|---|---|
| Main gateway | 3000 | User/expense CRUD, report generation |
| process-users | 3002 | User management |
| process-costs | 3003 | Cost/expense management |
| process-logs | 3001 | Request log retrieval |
| process-about | 3004 | Developer information |

All services share a single MongoDB Atlas cluster.

## Live Deployment (Render)

All four microservices are deployed on Render and always available:

| Service | URL |
|---|---|
| process-logs | https://process-logs.onrender.com |
| process-users | https://process-users.onrender.com |
| process-costs | https://process-costs.onrender.com |
| process-about | https://process-about.onrender.com |

### Using Postman with the live deployment

A ready-made Postman environment is included at `postman/Cost-Manager-Render.postman_environment.json`.

1. In Postman, click **Import** and select that file
2. Select **"Cost Manager Render"** from the environment dropdown (top-right)
3. Send requests — no local server needed

---

## Local Development

### Prerequisites

- Node.js 24.x
- A MongoDB Atlas connection string (configured via `.env`)

### Getting Started

1. Clone the repository.

2. Create a `.env` file in each `process-*/` directory with:
   ```
   MONGODB_USER=<your-atlas-username>
   MONGODB_PASS=<your-atlas-password>
   ```

3. Install dependencies for each service:
   ```bash
   cd process-users && npm install
   cd ../process-costs && npm install
   cd ../process-logs && npm install
   cd ../process-about && npm install
   ```

4. Start each service in a separate terminal:
   ```bash
   cd process-users && npm start      # process-users → port 3002
   cd process-costs && npm start      # process-costs → port 3003
   cd process-logs  && npm start      # process-logs  → port 3001
   cd process-about && npm start      # process-about → port 3004
   ```

5. Switch Postman to the **"Cost Manager Local"** environment (`postman/Cost-Manager.postman_environment.json`).

---

## API Endpoints

### process-users (port 3002)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/add` | Create a new user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get a user by ID (includes total spending) |

### process-costs (port 3003)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/add` | Add a new cost entry |
| GET | `/api/report` | Monthly cost report for a user |

### process-logs (port 3001)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/logs` | Retrieve all request logs |

### process-about (port 3004)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/about` | Get developer information |

---

## Request & Response Format

**Add user** (`POST /api/add` on process-users):
```json
{ "id": 123, "firstName": "John", "lastName": "Doe", "birthday": "1990-05-15" }
```

**Add cost** (`POST /api/add` on process-costs):
```json
{ "userid": 123, "description": "groceries", "category": "food", "sum": 45 }
```
Valid categories: `food`, `health`, `housing`, `sports`, `education`

**Get report** (`GET /api/report?id=123&year=2026&month=5` on process-costs):
```json
{
  "userid": 123,
  "year": 2026,
  "month": 5,
  "costs": [{ "food": [...] }, { "health": [...] }, ...]
}
```

---

## Project Structure

```
/
├── src/                    # Main gateway
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── process-users/src/      # process-users microservice
├── process-costs/src/      # process-costs microservice
├── process-logs/src/       # process-logs microservice
├── process-about/src/      # process-about microservice
├── tests/                  # Python pytest suite
└── postman/                # Postman collection and environments
```

---

## Running Tests

Tests are written in Python using pytest and target all four microservices.

```bash
cd tests
pip install -r requirements.txt
pytest test_api_local.py -v
```

Set `USERS_URL`, `COSTS_URL`, `LOGS_URL`, `ABOUT_URL` environment variables to target the Render deployment instead of localhost.

---

## Developers

- Ofek Danny
- Dor Alagem
- Yuval Oren
