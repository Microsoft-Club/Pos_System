# POS System

A point-of-sale web app for managing menu items, billing, receipts, and sales dashboards. The stack is **React + Vite** on the frontend and **Node.js + Express + PostgreSQL** on the backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally on port `5432`

## First-time setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd Pos_System

cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up the database

Create a PostgreSQL database, then apply the schema:

```bash
psql -U <your-postgres-user> -d <your-database-name> -f backend/schema.sql
```

Seed the database with sample data (company, menu items, and orders):

```bash
cd backend
npm run seed
```

### 3. Configure environment variables

**Backend** — create `backend/.env`:

```env
DATABASE_USERNAME=your_postgres_user
DATABASE_HOST=localhost
DATABASE_NAME=your_database_name
DATABASE_PASSWORD=your_postgres_password
DATABASE_PORT=5432
SERVER_PORT=5000
TAX_RATE=0
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## How to start the project

Open **two terminal windows** and run one command in each:

**Terminal 1 — Backend** (runs on port 5000):

```bash
cd backend
npm run dev
```

If `npm run dev` fails with a permission error on nodemon, start the server directly instead:

```bash
cd backend
NODE_ENV=development node server.js
```

**Terminal 2 — Frontend** (runs on port 5173):

```bash
cd frontend
npm run dev
```

Then open the app in your browser:

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173/   |
| Backend  | http://localhost:5000/   |

## Available pages

| Route        | Description                          |
|--------------|--------------------------------------|
| `/`          | Landing page with sales overview     |
| `/dashboard` | Sales dashboard and charts           |
| `/products`  | Menu item management                 |
| `/billing`   | Billing screen (placeholder)         |
| `/receipts`  | Receipt printing and order history   |

## Useful commands

```bash
# Backend
cd backend
npm run dev          # Start dev server with auto-reload
npm run seed         # Re-seed the database with sample data
npm test             # Run backend tests

# Frontend
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```
