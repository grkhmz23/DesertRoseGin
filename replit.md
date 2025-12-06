# Desert Rose Gin Landing Page

## Overview

This is a luxury landing page for Desert Rose Gin, a premium spirit brand. The application showcases sophisticated product presentation with an emphasis on visual storytelling and brand aesthetics. Built as a single-page application with React and TypeScript, it features a custom design system inspired by desert landscapes, utilizing warm color palettes (sand, gold, copper, charcoal) and luxury typography (Cinzel, Playfair Display, Space Mono).

The project is built on a full-stack Express/React architecture with database support through Drizzle ORM, though currently functioning primarily as a client-side marketing site with minimal backend integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for data fetching and state management

**UI Component Library:**
- Shadcn/ui components (New York style variant) for consistent UI patterns
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS with extensive customization for styling
- Framer Motion for animations and interactive transitions

**Design System:**
- Custom color palette defined in CSS variables (sand-light, sand, gold, copper, charcoal)
- Three-tier typography system using Google Fonts: Cinzel (luxury/headlines), Playfair Display (body), Space Mono (technical/HUD elements)
- Responsive grid system with mobile-first approach
- Custom spacing philosophy emphasizing generous whitespace for luxury feel

**Component Organization:**
- Path aliases configured (@/ for client/src, @shared for shared code, @assets for assets)
- UI components located in client/src/components/ui/
- Page components in client/src/pages/
- Reusable hooks in client/src/hooks/

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- HTTP server creation via Node's native http module
- Custom logging middleware for request/response tracking
- Static file serving for production builds

**Development vs Production:**
- Development: Vite dev server with HMR (Hot Module Replacement)
- Production: Pre-built static assets served by Express
- Replit-specific plugins for development banner and error overlays

**API Structure:**
- RESTful API design with /api prefix convention
- Route registration system in server/routes.ts
- Storage abstraction layer for database operations

### Data Storage

**ORM & Database:**
- Drizzle ORM configured for PostgreSQL
- Schema definitions in shared/schema.ts for code sharing between client/server
- Migration support via drizzle-kit
- Connection via DATABASE_URL environment variable

**Current Schema:**
- Users table with id (UUID primary key), username (unique), and password fields
- Zod validation schemas generated from Drizzle schemas

**Storage Interface:**
- Abstract IStorage interface defining CRUD operations
- In-memory implementation (MemStorage) for development/testing
- Methods: getUser, getUserByUsername, createUser
- Designed for easy swapping to database-backed implementation

### Authentication & Authorization

**Session Management:**
- Express-session middleware configured
- Support for both PostgreSQL-backed sessions (connect-pg-simple) and in-memory sessions (memorystore)
- Cookie-based session storage

**Authentication Strategy:**
- Passport.js integration prepared for local strategy
- User schema supports password-based authentication
- JWT support available through jsonwebtoken dependency

### External Dependencies

**Third-party UI Libraries:**
- Radix UI suite (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, slider, tabs, toast, tooltip, and more)
- Embla Carousel for image/content carousels
- Lucide React for consistent iconography
- React Hook Form with Zod resolvers for form validation
- class-variance-authority (CVA) for component variant management

**Development Tools:**
- ESBuild for server-side bundling
- PostCSS with Tailwind CSS and Autoprefixer
- TSX for running TypeScript in Node
- Replit-specific development plugins (cartographer, dev-banner, runtime-error-modal)

**Utility Libraries:**
- date-fns for date manipulation
- clsx and tailwind-merge for className management
- nanoid for unique ID generation

**Build Process:**
- Custom build script (script/build.ts) that:
  - Builds client with Vite
  - Bundles server with ESBuild
  - Optimizes dependencies by bundling allowlisted packages to reduce syscalls
  - Outputs to dist/ directory with separate public/ folder for client assets

**Environment Configuration:**
- NODE_ENV for environment detection
- DATABASE_URL for PostgreSQL connection
- Separate development and production startup scripts