# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite admin dashboard application. It manages products, categories, brands, orders, vouchers, and users for an e-commerce backend.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **TanStack React Query** for server state management
- **react-router-dom v7** for routing (createBrowserRouter pattern)
- **Axios** for HTTP requests (baseURL: http://localhost:3000/api)
- **Tailwind CSS v4** (via @tailwindcss/vite plugin)
- **Framer Motion** for animations

### Key Patterns

1. **API Layer** (`src/apis/*.ts`): Each entity has an API file (brand.api.ts, category.api.ts, etc.)

2. **Custom Hooks** (`src/hooks/*.ts`): React Query hooks wrap API calls (useAuth, useBrand, useCategory, useOrder, useProduct, useVoucher)

3. **Routing** (`src/routes.tsx`): Uses ProtectedRoute and PublicRoute components for auth flow

4. **Type Definitions** (`src/types/*.type.ts`): TypeScript interfaces for all entities

### Pages Structure

- `/login` - Public login page
- `/` - Dashboard (contains nested routes: brand, category, product)

### API Configuration

Axios instance is configured in `src/lib/axios.ts` with:

- Base URL from `VITE_API_URL` env variable (defaults to http://localhost:3000/api)
- Credentials enabled for cookies
- Request/response interceptors for CSRF token and 401 handling
