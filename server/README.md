# ContentOps Server Setup

## Prerequisites
1. **PostgreSQL 16+** installed and running
2. **Node.js 20+**

## Quick Start

### 1. Set up PostgreSQL
After installing PostgreSQL, create the database:

```powershell
# Open psql (use the password you set during PostgreSQL installation)
psql -U postgres

# In the psql shell, run:
CREATE USER contentops WITH PASSWORD 'contentops';
CREATE DATABASE contentops OWNER contentops;
\q
```

### 2. Configure environment
The `.env` file is already configured. If your PostgreSQL uses a different port or credentials, update:
```
DATABASE_URL=postgresql://contentops:contentops@localhost:5432/contentops
```

### 3. Install dependencies & set up database
```powershell
cd server
npm install
npx prisma db push
npm run db:seed
```

### 4. Start the server
```powershell
npm run dev
```

The API will be available at `http://localhost:3001/api`

### 5. Start the frontend (from root)
```powershell
cd ..
npm run dev
```

## API Endpoints
- `GET  /api/health` - Health check
- `POST /api/briefs` - Create content brief
- `POST /api/pipeline/run` - Trigger pipeline
- `GET  /api/analytics/dashboard` - Dashboard data
- See `implementation_plan.md` for full endpoint list
