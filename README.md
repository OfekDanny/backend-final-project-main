# Cost Manager - RESTful Web Services

A microservices-based cost manager built with Node.js, Express, Mongoose, and Pino, backed by MongoDB Atlas. The system is split into four independent Node.js processes, each deployed separately.

## Architecture

| Service | Port | Role | Endpoints |
|---|---|---|---|
| process-logs | 3001 | Admin - request log retrieval | `GET /api/logs` |
| process-users | 3002 | User management | `POST /api/add`, `GET /api/users`, `GET /api/users/:id` |
| process-costs | 3003 | Cost items + monthly reports | `POST /api/add`, `GET /api/report` |
| process-about | 3004 | Developer team info | `GET /api/about` |

All four processes share a single MongoDB Atlas cluster. Each `process-*` folder is an independent Node.js project with its own `package.json` and `.env`.

The monthly report endpoint implements the **Computed Design Pattern** - reports for past months are cached in the `reports` collection, while current/future months are recomputed from raw cost records (see [process-costs/src/utils/get-or-create-report.js](process-costs/src/utils/get-or-create-report.js)).

Logging is handled by Pino with a custom MongoDB write stream - every HTTP request and every endpoint access is persisted to the `logs` collection.

## Live Deployment (Render)

| Service | URL |
|---|---|
| process-logs | https://process-logs.onrender.com |
| process-users | https://process-users.onrender.com |
| process-costs | https://process-costs.onrender.com |
| process-about | https://process-about.onrender.com |

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.9+ (for the pytest suite)
- A MongoDB Atlas connection string

### Setup

1. Create a `.env` file in each `process-*/` directory:
   ```
   MONGODB_USER=<atlas-username>
   MONGODB_PASS=<atlas-password>
   PORT=<service-port>
   ```

2. Install dependencies in each service:
   ```bash
   cd process-logs  && npm install
   cd ../process-users && npm install
   cd ../process-costs && npm install
   cd ../process-about && npm install
   ```

3. Start each service in its own terminal:
   ```bash
   cd process-logs  && npm start    # port 3001
   cd process-users && npm start    # port 3002
   cd process-costs && npm start    # port 3003
   cd process-about && npm start    # port 3004
   ```

## API

### Add User - `POST /api/add` (process-users)
```json
{ "id": 123, "first_name": "John", "last_name": "Doe", "birthday": "1990-05-15" }
```

### Add Cost - `POST /api/add` (process-costs)
```json
{ "userid": 123, "description": "groceries", "category": "food", "sum": 45 }
```
Valid categories: `food`, `health`, `housing`, `sports`, `education`. Past dates are rejected.

### Monthly Report - `GET /api/report?id=123&year=2026&month=5` (process-costs)
```json
{
  "userid": 123, "year": 2026, "month": 5,
  "costs": [
    { "food": [ { "sum": 45, "description": "groceries", "day": 12 } ] },
    { "health": [] }, { "housing": [] }, { "sports": [] }, { "education": [] }
  ]
}
```

### Other endpoints
- `GET /api/users` (process-users) - list all users
- `GET /api/users/:id` (process-users) - user details + total spending
- `GET /api/logs` (process-logs) - all request logs
- `GET /api/about` (process-about) - developer names

All errors are returned as JSON with `id` and `message` fields.

## Testing

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r tests/requirements.txt
pytest -q                                    # 13 tests against localhost
python tests/run_spec_local.py               # spec sample script, localhost
python tests/run_spec_render.py              # spec sample script, Render
```

## Project Structure

```
backend-final-project/
|-- process-logs/    # microservice (a) - port 3001
|-- process-users/   # microservice (b) - port 3002
|-- process-costs/   # microservice (c) - port 3003
|-- process-about/   # microservice (d) - port 3004
`-- tests/           # Python pytest suite + spec runners
```

## Developers

- Dor Alagem (team manager)
- Ofek Danny
- Yuval Oren
