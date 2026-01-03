# GlobeTrotter Backend API

Complete Node.js + Express + MongoDB + Socket.IO backend for the GlobeTrotter travel planning application.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB with Mongoose ODM
- ✅ Real-time updates with Socket.IO
- ✅ JWT Authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ Security middleware (Helmet, CORS)
- ✅ TypeScript support
- ✅ Error handling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Real-time**: Socket.IO
- **Auth**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Language**: TypeScript

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd globetrotter_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your `.env` file with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/globetrotter
JWT_SECRET=your-secret-key
PORT=5000
```

5. Start MongoDB (if running locally):
```bash
mongod
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (requires auth)
- `PUT /api/v1/auth/profile` - Update user profile (requires auth)

### Trips
- `GET /api/v1/trips` - Get all user trips (requires auth)
- `GET /api/v1/trips/:id` - Get trip by ID (requires auth)
- `POST /api/v1/trips` - Create new trip (requires auth)
- `PUT /api/v1/trips/:id` - Update trip (requires auth)
- `DELETE /api/v1/trips/:id` - Delete trip (requires auth)
- `POST /api/v1/trips/:id/share` - Generate share URL (requires auth)
- `GET /api/v1/trips/shared/:shareUrl` - Get shared trip (public)

### Trip Cities
- `POST /api/v1/trips/:id/cities` - Add city to trip (requires auth)
- `DELETE /api/v1/trips/:id/cities/:cityId` - Remove city from trip (requires auth)

### Trip Activities
- `POST /api/v1/trips/:id/cities/:cityId/activities` - Add activity to city (requires auth)
- `DELETE /api/v1/trips/:id/cities/:cityId/activities/:activityId` - Remove activity (requires auth)

### Cities
- `GET /api/v1/cities` - Get all cities
- `GET /api/v1/cities/search?q=...` - Search cities
- `GET /api/v1/cities/:id` - Get city by ID

### Activities
- `GET /api/v1/activities` - Get all activities
- `GET /api/v1/activities/search?q=...` - Search activities
- `GET /api/v1/activities/:id` - Get activity by ID

## Socket.IO Events

### Client to Server
- `trip:join` - Join a trip room for real-time updates
- `trip:leave` - Leave a trip room
- `trip:update` - Update trip (broadcasts to all in room)
- `trip:city:add` - Add city to trip
- `trip:city:remove` - Remove city from trip
- `trip:activity:add` - Add activity to city
- `trip:activity:remove` - Remove activity from city

### Server to Client
- `trip:updated` - Trip was updated
- `trip:city:added` - City was added to trip
- `trip:city:removed` - City was removed from trip
- `trip:activity:added` - Activity was added to city
- `trip:activity:removed` - Activity was removed from city

## Project Structure

```
globetrotter_backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── socket.ts          # Socket.IO configuration
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── tripController.ts  # Trip CRUD operations
│   │   ├── cityController.ts  # City operations
│   │   └── activityController.ts # Activity operations
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── validate.ts        # Input validation
│   │   ├── errorHandler.ts    # Error handling
│   │   └── index.ts           # Middleware exports
│   ├── models/
│   │   ├── User.ts            # User model
│   │   ├── Trip.ts            # Trip model
│   │   ├── City.ts            # City model
│   │   ├── Activity.ts        # Activity model
│   │   └── index.ts           # Model exports
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth routes
│   │   ├── tripRoutes.ts      # Trip routes
│   │   ├── cityRoutes.ts      # City routes
│   │   ├── activityRoutes.ts  # Activity routes
│   │   └── index.ts           # Route aggregator
│   └── server.ts              # Express app setup
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## Database Models

### User
```typescript
{
  email: string;
  password: string (hashed);
  name: string;
  avatar?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Trip
```typescript
{
  userId: ObjectId;
  name: string;
  description: string;
  coverImage?: string;
  startDate: Date;
  endDate: Date;
  cities: City[];
  budget: number;
  costBreakdown: {
    stay: number;
    transport: number;
    activities: number;
    meals: number;
  };
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Helmet for security headers
- CORS protection
- Rate limiting to prevent abuse
- Input validation on all endpoints

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/globetrotter |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:8080 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT
