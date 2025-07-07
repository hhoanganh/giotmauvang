## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project Context
You are developing a blood donation web app using:
- React + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Server Actions for backend logic
- Mobile-first design

## ALWAYS follow this architecture pattern:
1. RLS POLICIES handle database-level security (row access control)
2. SERVER ACTIONS handle business logic, validation, and complex operations
3. Components call Server Actions, not direct Supabase queries
4. Never expose sensitive logic to the client

## SECURITY REQUIREMENTS:
- All database tables have RLS enabled
- Users can only access their own data (except staff/admin)
- Staff/Medical/Admin can access operational data
- System Admin has full access
- Never trust client-side data - validate everything in Server Actions
- Hide API keys, business logic, and sensitive operations in Server Actions

## SERVER ACTION PATTERNS:
- Always use 'use server' directive
- Validate all inputs before database operations
- Handle business rules (e.g., donation frequency, capacity limits)
- Use proper error handling with try/catch
- Return structured responses
- Keep functions focused and single-purpose
- Document complex business logic with comments

## DATABASE PATTERNS:
- Use existing table structure (profiles, donation_centers, events, appointments, health_declarations, donation_records, news_articles, faqs, notifications)
- Include center_id in relevant tables for future scalability
- Use primary_role in profiles for RBAC (donor, center_staff, medical_professional, system_admin)
- Never bypass RLS - let policies handle access control

## CODE STYLE:
- Use TypeScript with proper types
- Use async/await for all database operations
- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Follow React Server Actions patterns
- Use proper error messages for users