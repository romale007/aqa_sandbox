# Motorbike Store - Test Automation Sandbox

A web application designed for test automation lessons, featuring an online motorbike store.

## Project Structure

```
motorbike-store/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── database/          # PGlite database files
```

## Features

- Browse motorbikes catalog
- View detailed motorbike information
- Add motorbikes to shopping cart
- User authentication
- Order management

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: PGlite
- Testing: Jest, React Testing Library

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing

To run tests:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```
