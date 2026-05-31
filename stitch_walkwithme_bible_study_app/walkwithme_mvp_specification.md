# WalkWithMe App – Full Documentation (MVP Version)

## 1. Introduction
WalkWithMe is a spiritual-growth mobile and web application designed to help users develop a consistent Bible study habit, engage in daily reflections, and build a structured quiet-time life.

This documentation describes the MVP (Minimum Viable Product) version focusing on:
- Daily Quiet Time Flow
- Bible Reading System
- Reflection & Journaling
- User Authentication
- Basic Progress Tracking

## 2. Core Features (MVP Scope)
1. User Authentication (Email/Password)
2. Daily Quiet Time Home Screen
3. Bible Reading Screen (KJV only for now)
4. Reflection Prompts & Journal Entry
5. Journal List & History
6. Reading Progress Tracking
7. Simple Streak Counter

## 3. User Flow Explanation
1. User logs in or signs up.
2. They land on the “Start Quiet Time” screen.
3. They select “Start Today’s Reading”.
4. They read the scripture for the day.
5. After reading, they tap “Continue to Reflection”.
6. They answer reflection prompts and submit.
7. Submission is saved to the Journal.
8. User can later view past entries in Journal History.

## 4. Technical Architecture
**Frontend:**
- Next.js 14
- App Router
- React, TypeScript
- Tailwind or React Bootstrap

**Backend:**
- Supabase Authentication
- Supabase Database
- Supabase Storage (optional future use)

**Bible Data:**
- Local JSON file (KJV)
- Loaded and rendered client-side

**APIs:**
- Custom internal endpoints for reflections, journals, streak

## 5. Database Schema
**TABLE: journal_entries**
- id (uuid)
- user_id (uuid)
- date (date)
- scripture_reference (text)
- content (text) – reflection answer
- created_at (timestamp)

**TABLE: reading_progress**
- id (uuid)
- user_id (uuid)
- date (date)
- book (text)
- chapter (integer)
- completed (boolean)
- created_at (timestamp)

**TABLE: streaks**
- id (uuid)
- user_id (uuid)
- current_streak (integer)
- longest_streak (integer)
- last_active_date (date)

## 7. App Screens & Components
**Screens:**
1. Start Quiet Time Screen (Dashboard)
2. Bible Reading Screen
3. Reflection Screen
4. Journal List Screen
5. Journal Details Screen
