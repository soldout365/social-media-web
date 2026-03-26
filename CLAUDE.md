# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack e-commerce platform with three main components:

- **backend** - Express.js API server with MongoDB
- **frontend** - Customer-facing React application
- **admin** - Admin dashboard (React + TypeScript)

## Commands

### Root (Monorepo)

```bash
npm run build   # Install deps and build frontend
npm run start  # Start backend server
```

### Backend

```bash
cd backend
npm run dev    # Start with nodemon (auto-reload)
npm run start  # Start production server
```

### Frontend

```bash
cd frontend
npm run dev    # Start Vite dev server
npm run build  # Production build
npm run lint   # Run ESLint
npm run preview # Preview production build
```

### Admin

```bash
cd admin
npm run dev    # Start Vite dev server
npm run build  # Production build
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## Architecture

### Backend (Express.js + MongoDB)

- **Entry**: `src/server.js`
- **Database**: MongoDB with Mongoose ODM
- **API Routes**: RESTful under `/api/*` prefix
  - `/api/auth` - Authentication (register, login, logout)
  - `/api/product` - Product CRUD
  - `/api/category` - Category management
  - `/api/brand` - Brand management
  - `/api/voucher` - Coupon/voucher codes
  - `/api/order` - Order management
  - `/api/cart` - Shopping cart
  - `/api/payment` - VNPay integration
  - `/api/messages` - Real-time messaging
  - `/api/stream` - Stream Chat integration
  - `/api/post` - Blog posts

- **Key Libraries**:
  - Socket.io for real-time communication
  - JWT for authentication
  - Cloudinary for image storage
  - Arcjet for security
  - Resend for transactional emails

- **Structure**:
  - `src/controllers/` - Route handlers
  - `src/services/` - Business logic
  - `src/models/` - Mongoose schemas
  - `src/routes/` - Express routers
  - `src/middleware/` - Express middleware
  - `src/lib/` - Utilities (db, socket, cloudinary, env)
  - `src/emails/` - Email templates

### Frontend (React + Vite)

- **Tech Stack**: React 18, Vite, Redux Toolkit, TanStack Query, React Router, Tailwind CSS
- **Key Libraries**:
  - Stream Chat SDK for messaging
  - Socket.io client
  - Radix UI primitives
  - Framer Motion animations
  - Zustand for some state

- **API Base**: `http://localhost:3000/api`

### Admin (React + TypeScript + Vite)

- **Tech Stack**: React 19, TypeScript, Vite, TanStack Query, Tailwind CSS v4
- **API Base**: `http://localhost:3000/api`
- **Routing**: Uses react-router-dom v7 with ProtectedRoute pattern

## Environment Variables

Backend requires `.env` file with:

- `MONGO_URI` - MongoDB connection
- `JWT_SECRET` - JWT signing key
- `CLOUDINARY_*` - Cloudinary config
- `VNP_*` - VNPay payment config
- `RESEND_API_KEY` - Email service
- `ARCJET_KEY` - Security

## Development Notes

- Frontend runs on `localhost:5173`
- Admin runs on `localhost:5174`
- Backend runs on `localhost:3000`
- CORS configured for frontend (5173) and admin (5174) origins
