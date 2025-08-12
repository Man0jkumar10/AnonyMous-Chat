# Overview

This is a real-time anonymous chat application similar to Omegle, built with a modern web stack. The application allows users to connect with random strangers for text-based conversations without requiring account registration. It features instant WebSocket-based messaging, automatic user matching, and temporary in-memory storage that ensures complete anonymity by not persisting chat data.

The system implements a simple matchmaking queue where users are paired with other waiting users, creating temporary chat rooms that are destroyed when either participant leaves. The application emphasizes privacy by storing no conversation history and maintaining no user accounts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component-based development
- **Styling**: TailwindCSS with Shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Custom React hooks for WebSocket connection state and chat functionality
- **Real-time Communication**: Native WebSocket API for direct server communication
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for HTTP server functionality
- **WebSocket Server**: Native WebSocket (ws) library for real-time bidirectional communication
- **Message Handling**: Structured message types with Zod validation for type-safe WebSocket communication
- **Storage Pattern**: In-memory storage using Map data structures for temporary user sessions and chat rooms
- **Matchmaking Logic**: Simple queue-based system for pairing users randomly

## Data Storage Strategy
- **Session Storage**: Temporary in-memory storage for connected users and active chat rooms
- **Message Handling**: No persistent storage - messages exist only during active chat sessions
- **User Management**: Stateless user identification using UUID generation for anonymous sessions
- **Database Configuration**: Drizzle ORM configured for PostgreSQL (unused in current implementation but available for future features)

## Real-time Communication Design
- **WebSocket Implementation**: Custom WebSocket server on `/ws` endpoint to avoid conflicts with Vite HMR
- **Message Protocol**: Structured message types including JOIN_QUEUE, SEND_MESSAGE, PARTNER_FOUND, etc.
- **Connection Management**: Automatic cleanup of disconnected users and orphaned chat rooms
- **Typing Indicators**: Real-time typing status updates between chat partners

## Security and Privacy Approach
- **Anonymous Sessions**: No user authentication or persistent user data
- **Temporary Storage**: All chat data exists only in server memory during active sessions
- **Automatic Cleanup**: Chat rooms and messages are immediately destroyed when users disconnect
- **Message Validation**: Server-side validation of all WebSocket messages using Zod schemas

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React, React DOM, and React Query for state management and data fetching
- **TypeScript**: Full TypeScript support across client and server
- **Vite**: Modern build tool with React plugin and development server
- **Express.js**: Web framework for HTTP server and middleware support

## UI and Styling
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing
- **Radix UI**: Headless component primitives via Shadcn/ui for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant management for component styling

## Real-time Communication
- **WebSocket (ws)**: Native WebSocket implementation for server-side real-time communication
- **Zod**: Runtime type validation for WebSocket message schemas

## Development Tools
- **TSX**: TypeScript execution for development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **Wouter**: Lightweight routing library for client-side navigation

## Database Infrastructure (Configured but Unused)
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database connection ready for future features
- **Migration System**: Drizzle Kit for database schema management

## Optional Integrations
- **Replit Integration**: Development environment integration with cartographer plugin for enhanced debugging