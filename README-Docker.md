# Docker Setup for игрите.bg with MongoDB

## Quick Start

1. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## Services

- **mongodb**: MongoDB 7.0 database
- **backend**: Node.js/Express API server  
- **frontend**: React app served via Nginx

## Backend Structure

Move the backend files to a `backend/` folder:
```
backend/
├── src/
│   ├── config/database.ts
│   ├── models/
│   ├── services/
│   └── server/app.ts
├── package.json
└── tsconfig.json
```

## Environment Variables

The services use these environment variables:
- `MONGODB_URI=mongodb://mongodb:27017/igrite-bg`  
- `PORT=3001`
- `NODE_ENV=production`

## Development

For local development:
```bash
# Backend only
cd backend && npm run dev

# Frontend only  
npm run dev
```