# 🧟 Zombie Survival Game - Backend

Production-ready Express.js backend for a Zombie Survival game with JWT authentication, PostgreSQL database, and Prisma ORM.

## 🚀 Tech Stack

- **Node.js** (v18+) - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database toolkit
- **JWT** - Token-based authentication
- **TypeScript** - Type safety and modern JS features
- **bcryptjs** - Secure password hashing
- **CORS** - Cross-origin resource sharing

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or higher
- **PostgreSQL** v13 or higher
- **pnpm** v8.0.0 or higher (recommended) or npm

## 📦 Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/zombie_game?schema=public"
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration (optional)
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma Client
   pnpm run prisma:generate
   
   # Run database migrations
   pnpm run prisma:migrate
   ```

## 🎮 Running the Application

**Development mode (with hot reload):**
```bash
pnpm run dev
```

**Production mode:**
```bash
# Build TypeScript to JavaScript
pnpm run build

# Start production server
pnpm start
```

The server will start on `http://localhost:3000` by default.

## 📊 Database Management

**Open Prisma Studio (Database GUI):**
```bash
pnpm run prisma:studio
```

**Create a new migration:**
```bash
pnpm exec prisma migrate dev --name your_migration_name
```

**Reset database (⚠️ Warning: Deletes all data):**
```bash
pnpm exec prisma migrate reset
```

## 🔐 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "player123",
  "email": "player@example.com",
  "password": "securepass123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "player123",
    "email": "player@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "error": "User already exists"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "player@example.com",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "player123",
    "email": "player@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### Game Endpoints

**⚠️ All game endpoints require authentication header:**
```
Authorization: Bearer <your-jwt-token>
```

#### Save Game Session
```http
POST /game/session
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 15000,
  "waveReached": 25,
  "duration": 1800
}
```

**Success Response (201):**
```json
{
  "message": "Game session saved successfully",
  "session": {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "score": 15000,
    "waveReached": 25,
    "duration": 1800,
    "createdAt": "2026-02-02T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid game data. Score doesn't match wave progression."
}
```

#### Get Leaderboard
```http
GET /game/leaderboard?limit=50
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "leaderboard": [
    {
      "username": "player123",
      "score": 50000,
      "waveReached": 50,
      "createdAt": "2026-02-01T15:30:00.000Z"
    }
  ]
}
```

#### Get User Game History
```http
GET /game/history?limit=20
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "history": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "score": 15000,
      "waveReached": 25,
      "duration": 1800,
      "createdAt": "2026-02-02T10:30:00.000Z"
    }
  ]
}
```

#### Health Check
```http
GET /health
```

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

## 🛡️ Security Features

- **Password Hashing:** bcrypt with salt rounds of 12
- **JWT Authentication:** Stateless token-based auth for protected routes
- **Input Validation:** express-validator sanitizes and validates all inputs
- **Anti-Cheat System:** Server-side score validation based on wave progression
- **CORS Protection:** Configurable cross-origin resource sharing
- **SQL Injection Protection:** Prisma ORM with parameterized queries
- **Rate Limiting Ready:** Middleware structure supports rate limiting
- **Environment Variables:** Sensitive data stored in .env file

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Database migration files
├── src/
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts  # Authentication logic
│   │   └── game.controller.ts  # Game session logic
│   ├── middleware/             # Express middleware
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── validation.middleware.ts  # Input validation
│   │   └── error.middleware.ts # Global error handler
│   ├── routes/                 # API route definitions
│   │   ├── auth.routes.ts      # /auth endpoints
│   │   └── game.routes.ts      # /game endpoints
│   ├── services/               # Business logic layer
│   │   ├── auth.service.ts     # Auth business logic
│   │   └── game.service.ts     # Game business logic
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
├── .env                        # Environment variables (create this)
├── package.json                # Project dependencies
├── pnpm-lock.yaml             # Locked dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🎯 Anti-Cheat System

The backend implements server-side anti-cheat validation to prevent score manipulation:

### Validation Rules

- **Score Range:** 0 to 1,000,000 points
- **Wave Range:** 0 to 1,000 waves
- **Duration:** Maximum 24 hours (86,400 seconds)
- **Score-Wave Correlation:**
  - Minimum expected score: `waveReached × 50 points`
  - Maximum expected score: `waveReached × 500 points`
  
### Example Validations

✅ **Valid:** Wave 20, Score 5,000 (250 points/wave)  
❌ **Invalid:** Wave 10, Score 100,000 (10,000 points/wave - too high)  
❌ **Invalid:** Wave 50, Score 1,000 (20 points/wave - too low)

## 🔧 Database Schema

### User Model
```prisma
model User {
  id            String        @id @default(uuid())
  username      String        @unique
  email         String        @unique
  password      String
  createdAt     DateTime      @default(now())
  gameSessions  GameSession[]
}
```

### GameSession Model
```prisma
model GameSession {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  score        Int
  waveReached  Int
  duration     Int
  createdAt    DateTime @default(now())
}
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `NODE_ENV` | Application environment | No | `development` | `production` |
| `PORT` | Server port | No | `3000` | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | - | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | **Yes** | - | `your-256-bit-secret` |
| `JWT_EXPIRES_IN` | Token expiration time | No | `7d` | `24h`, `7d`, `30d` |
| `CORS_ORIGIN` | Allowed CORS origins | No | `*` | `http://localhost:5173` |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server with hot reload |
| `pnpm run build` | Build TypeScript to JavaScript (outputs to `dist/`) |
| `pnpm start` | Start production server from `dist/` |
| `pnpm run prisma:generate` | Generate Prisma Client types |
| `pnpm run prisma:migrate` | Run database migrations in dev |
| `pnpm run prisma:studio` | Open Prisma Studio database GUI |

## 🚀 Deployment Guide

### Production Deployment Steps

1. **Set production environment variables:**
   ```bash
   NODE_ENV=production
   DATABASE_URL=<your-production-database-url>
   JWT_SECRET=<strong-random-secret>
   PORT=3000
   CORS_ORIGIN=https://yourgame.com
   ```

2. **Install dependencies:**
   ```bash
   pnpm install --prod
   ```

3. **Build the application:**
   ```bash
   pnpm run build
   ```

4. **Run database migrations:**
   ```bash
   pnpm exec prisma migrate deploy
   ```

5. **Start the server:**
   ```bash
   pnpm start
   ```

### Deployment Platforms

#### Render (Recommended - Includes render.yaml)

1. **Create PostgreSQL Database:**
   - Go to Render Dashboard → New → PostgreSQL
   - Copy the Internal Database URL

2. **Create Web Service:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration
   - Or manually configure:
     - **Build Command:** `pnpm install && pnpm run build`
     - **Start Command:** `pnpm start`

3. **Set Environment Variables:**
   - `DATABASE_URL` - Your PostgreSQL Internal Database URL
   - `JWT_SECRET` - Strong random secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NODE_ENV` - `production`
   - `PORT` - `10000` (or leave empty, Render sets this automatically)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically run migrations and start your app

#### Other Platforms

- **Railway:** Auto-detects Node.js, add PostgreSQL service
- **Heroku:** Add PostgreSQL addon, set buildpack to Node.js
- **DigitalOcean:** Use App Platform with PostgreSQL managed database
- **AWS:** EC2 + RDS PostgreSQL or ECS with Fargate
- **Vercel:** Configure with serverless functions (requires adapter)

### Post-Deployment Checklist

- ✅ Environment variables are set correctly
- ✅ Database migrations have run successfully
- ✅ CORS is configured for your frontend domain
- ✅ JWT_SECRET is a strong, random value
- ✅ Health check endpoint returns 200 OK
- ✅ SSL/TLS is enabled (HTTPS)

## 🧪 Testing the API

**Using cURL:**
```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Using Postman/Thunder Client:**
1. Import the endpoints listed in API Documentation
2. Set Authorization header for protected routes
3. Test all CRUD operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ for zombie survival enthusiasts**
