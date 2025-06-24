# MY POCKET BUDDY - Children's Exercise Application

## Overview

MY POCKET BUDDY is a full-stack web application designed to make exercise fun and accessible for children. The application features both a main app with video upload capabilities and a static website version optimized for deployment. It provides structured exercise programs, interactive video content, and progress tracking to help families stay active together.

## System Architecture

### Full-Stack Application
- **Frontend**: React 18 with TypeScript, using Vite for build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with Radix UI components for accessibility
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management

### Static Website Version
- **Framework**: React 18 with TypeScript (website-version directory)
- **Build Tool**: Vite optimized for static site generation
- **Styling**: Tailwind CSS with custom design system
- **Focus**: SEO optimization, accessibility, and web performance

## Key Components

### Database Schema
The application uses Drizzle ORM with PostgreSQL, defining three main entities:
- **Exercises**: Core exercise data with video URLs, categories, age groups, and completion status
- **Playlists**: User-created collections of exercises with active playlist tracking
- **Progress**: Exercise completion tracking with timestamps and streak calculation

### API Architecture
RESTful API endpoints organized by resource:
- `/api/exercises` - CRUD operations for exercises with category filtering
- `/api/playlists` - Playlist management and active playlist tracking
- `/api/progress` - Progress tracking and streak calculation
- Video upload handling with multer middleware

### Frontend Architecture
Component-based React architecture with:
- **Pages**: Route-level components (home, search, playlist, category, programs)
- **Components**: Reusable UI components with accessibility features
- **Hooks**: Custom hooks for state management (use-programs, use-app-text, use-swipe)
- **Modals**: Video player, upload, and completion modals for user interactions

### Video Management
- Local video upload with multer
- Vimeo integration service for cloud video hosting
- Support for MP4, WebM, and AVI formats with 100MB file size limit
- Video thumbnail generation and serving

## Data Flow

1. **Exercise Management**: Users can upload videos, create exercises with metadata, and organize them by categories
2. **Playlist Creation**: Exercises can be added to custom playlists with drag-and-drop functionality
3. **Progress Tracking**: Exercise completions are recorded with timestamps for streak calculation
4. **Program Execution**: Structured exercise programs guide users through sequential activities

## External Dependencies

### Core Libraries
- **Database**: Drizzle ORM with Neon serverless PostgreSQL
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for caching and synchronization
- **Media Handling**: Multer for file uploads, Vimeo API for video hosting

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Type Safety**: TypeScript with strict configuration
- **Validation**: Zod schemas integrated with Drizzle for type-safe operations

## Deployment Strategy

### Replit Configuration
- **Environment**: Node.js 20 with PostgreSQL 16 module
- **Development**: `npm run dev` starts the full-stack application on port 5000
- **Production**: Build process creates optimized client and server bundles
- **Database**: Uses environment variable DATABASE_URL for connection

### Build Process
1. Client build: Vite processes React app and outputs to `dist/public`
2. Server build: esbuild bundles Express server to `dist/index.js`
3. Database migrations: Drizzle handles schema changes with `db:push` command

### Static Website Deployment
The website-version directory contains a standalone React application optimized for:
- Static hosting platforms
- SEO with Open Graph and Twitter Card meta tags
- Progressive Web App capabilities
- Accessibility compliance with ARIA labels and keyboard navigation

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.