# GlobeTrotter - Travel Planning Application

A modern, full-stack travel planning application built with React, TypeScript, Node.js, and MongoDB.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT and bcrypt password hashing
- **Trip Planning**: Create and manage trips with dates, budgets, and itineraries
- **City Discovery**: Browse and search cities with state-based filtering (Tamil Nadu cities included)
- **Activity Selection**: Add tourist places to cities with automatic cost calculation
- **Real-time Cost Tracking**: Automatically calculates trip costs based on selected activities
- **Currency**: All amounts displayed in Indian Rupees (INR)
- **Calendar View**: Visualize trips on a calendar
- **Responsive Design**: Modern UI with TailwindCSS and shadcn/ui components

## 📁 Project Structure

```
ODOO_HACK/
├── globetrotter_backend/    # Node.js + Express + MongoDB backend
├── globetrotter_frontend/   # React + TypeScript + Vite frontend
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd globetrotter_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   - Set `JWT_SECRET` to a secure random string
   - Update `MONGODB_URI` if using a different database
   - Adjust `CORS_ORIGIN` to match your frontend URL

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd globetrotter_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:8080` (or another port if 8080 is busy)

### MongoDB Setup

1. Make sure MongoDB is running on your system:
   ```bash
   # Windows (if installed as service)
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

2. The application will create a database named `globetrotter` automatically

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.IO** for real-time features

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Axios** for API requests
- **React Router** for navigation
- **date-fns** for date manipulation

## 📦 Available Scripts

### Backend
- `npm run dev` - Start development server with tsx
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (authenticated)
- `PUT /api/v1/auth/profile` - Update user profile (authenticated)

### Trips
- `GET /api/v1/trips` - Get all user trips
- `POST /api/v1/trips` - Create new trip
- `GET /api/v1/trips/:id` - Get trip by ID
- `PUT /api/v1/trips/:id` - Update trip
- `DELETE /api/v1/trips/:id` - Delete trip

### Cities & Activities
- `GET /api/v1/cities` - Get all cities
- `GET /api/v1/cities/:id` - Get city by ID
- `GET /api/v1/activities` - Get all activities

## 🎨 Features Highlights

### Tamil Nadu Cities
The app includes 8 major Tamil Nadu cities with 26 tourist places:
- Chennai (Marina Beach, Kapaleeshwarar Temple, Fort St. George, etc.)
- Madurai (Meenakshi Temple, Thirumalai Nayak Palace, etc.)
- Coimbatore (Marudamalai Temple, Siruvani Waterfalls, etc.)
- Kanyakumari (Vivekananda Rock, Thiruvalluvar Statue, etc.)
- Ooty (Botanical Gardens, Nilgiri Railway, etc.)
- Pondicherry (Auroville, French Quarter, etc.)
- Rameswaram (Ramanathaswamy Temple, Pamban Bridge, etc.)
- Thanjavur (Brihadeeswarar Temple, Thanjavur Palace, etc.)

### Auto Cost Calculation
- Select a city → Tourist places dropdown opens automatically
- Add activities → Trip cost updates in real-time
- Remove activities → Cost recalculates instantly

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- CORS configured for secure cross-origin requests
- Helmet.js for security headers
- Rate limiting to prevent abuse

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/globetrotter
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:8080
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- Unsplash for placeholder images
- All contributors who helped with the project
