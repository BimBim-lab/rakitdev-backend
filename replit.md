# RakitDev - Marketing Website & Admin Dashboard

## Overview

RakitDev is a modern fullstack marketing website for a web development studio. The application consists of a public-facing marketing site showcasing services, portfolio, blog, and pricing, alongside a simple admin dashboard for content management. Currently, the application uses mock/static data and is designed with a clean separation between frontend and backend, ready for future database integration.

**Purpose**: Present RakitDev's web development services to potential clients while providing internal tools for managing content.

**Current State**: UI-focused prototype with mock data. No authentication or database connections implemented yet.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: 
- **shadcn/ui** components built on Radix UI primitives provide the foundation for all UI elements
- Custom component library organized into three categories:
  - `components/layout`: Navbar, Footer (shared across all pages)
  - `components/marketing`: Public-facing components (Hero, ServiceCard, BlogCard, etc.)
  - `components/admin`: Dashboard-specific components (AdminSidebar, ProjectsTable, etc.)
- **Styling**: Tailwind CSS with custom design system following the brand guidelines defined in `design_guidelines.md`
- **Color Palette**: Custom CSS variables for theming with primary blue (#1A73E8), dark navy (#0D1F2D), and accent colors

**Routing**: 
- Wouter for client-side routing (lightweight alternative to React Router)
- Public routes: Home, Services, Portfolio, Blog, Pricing, About, Contact
- Admin routes: Overview, Projects, Blog Management, Pricing Management

**State Management**:
- React Query (TanStack Query) for server state management and data fetching
- React Hook Form with Zod validation for form state and validation
- Local component state with React hooks

**Data Flow**: 
- Currently uses mock data from `client/src/lib/mock-data.ts`
- Prepared for API integration with query functions defined in `queryClient.ts`
- Forms ready to submit to backend endpoints (currently console logging only)

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Application Structure**:
- `server/index.ts`: Main server entry point with middleware setup
- `server/routes.ts`: API route definitions (currently empty, ready for implementation)
- `server/storage.ts`: Storage interface abstraction with in-memory implementation
- `server/static.ts`: Static file serving for production builds
- `server/vite.ts`: Vite development server integration for HMR

**Design Patterns**:
- **Storage Interface Pattern**: `IStorage` interface allows switching between in-memory and database implementations without changing application code
- **Repository Pattern**: Ready to implement CRUD operations through the storage interface
- **Middleware Chain**: Express middleware for JSON parsing, request logging, and error handling

**API Design** (prepared but not implemented):
- RESTful API structure with `/api` prefix
- CRUD operations for projects, blog posts, inquiries, and pricing plans
- Response/request logging middleware for debugging

### Database Schema

**ORM**: Drizzle ORM configured for PostgreSQL

**Schema Definition** (`shared/schema.ts`):
- Users table with UUID primary keys
- Prepared for expansion to include projects, blog posts, inquiries, and pricing tables

**Database Provider**: Configured for Neon Database (@neondatabase/serverless)

**Migration Strategy**: Drizzle Kit for schema migrations (`npm run db:push`)

**Current State**: Schema defined but database connection not active. Application uses `MemStorage` class for in-memory data storage during development.

### Build System

**Development**:
- Vite dev server with HMR for instant updates
- TypeScript compilation without emit (type checking only)
- Express server runs concurrently for API development

**Production**:
- Client: Vite builds optimized React bundle to `dist/public`
- Server: esbuild bundles Express server to single `dist/index.cjs` file
- Custom build script (`script/build.ts`) coordinates both builds
- Server dependencies are selectively bundled (allowlist) to reduce cold start times

**Path Aliases**:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Authentication & Authorization

**Current State**: Not implemented

**Prepared Infrastructure**:
- User schema defined in database
- Password field ready for hashing
- Session middleware dependencies installed (express-session, connect-pg-simple)

**Future Implementation Plan**:
- Passport.js for authentication strategy
- Session-based auth with PostgreSQL session store
- Protected admin routes

## External Dependencies

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Unstyled, accessible component primitives (20+ components installed)
- **shadcn/ui**: Pre-built components using Radix UI and Tailwind
- **Lucide React**: Icon library
- **React Icons**: Additional icons (Simple Icons for tech stack logos)
- **class-variance-authority**: Type-safe component variants
- **tailwind-merge**: Intelligent Tailwind class merging

### Frontend Libraries
- **React 18**: UI library
- **TypeScript**: Type safety across the codebase
- **Wouter**: Lightweight routing (2KB alternative to React Router)
- **TanStack Query v5**: Server state management and data fetching
- **React Hook Form**: Form state management
- **Zod**: Schema validation for forms and API data
- **date-fns**: Date formatting and manipulation

### Backend Framework
- **Express**: Web server framework
- **tsx**: TypeScript execution for development

### Database & ORM
- **Drizzle ORM**: TypeScript ORM with type-safe queries
- **Neon Serverless**: PostgreSQL database provider (serverless-friendly)
- **Drizzle Zod**: Generate Zod schemas from Drizzle tables

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for server code
- **PostCSS**: CSS processing with Tailwind

### Development Tools
- **Replit Plugins**: Dev banner, cartographer, and runtime error modal for Replit environment
- **TypeScript**: Strict type checking with ESNext module resolution

### Session & Storage (Installed, Not Active)
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **memorystore**: In-memory session store alternative

### Future Integration Points (Dependencies Installed)
- **Nodemailer**: Email sending capability (for contact forms)
- **Stripe**: Payment processing (for potential booking/payment features)
- **Multer**: File upload handling (for image uploads in admin)
- **nanoid/uuid**: Unique ID generation