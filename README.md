# Redo: Gamified Self-Improvement System

## Overview

Redo is a personal development project designed to turn real-life goals into a gamified experience inspired by RPG systems. The core idea is to track habits, routines, and progress through a system of quests, XP, levels, penalties, and streaks—transforming self-improvement into a game.

## Inspiration

* Inspired by RPG progression systems (e.g., Solo Leveling, Skyrim, Habitica).
* Created out of frustration with traditional self-help methods.
* Designed to support goals such as weight loss, career advancement, discipline-building, and mental wellness.

## Key Goals

* Build discipline with structured routines.
* Visualize real-life progress through gamification.
* Create a system flexible enough to evolve with user goals.
* Eliminate junk food dependency and improve physical health.
* Improve productivity and motivation with feedback loops (XP, levels, penalties).

## Core Features

### 🎯 Daily Quests

* Predefined core tasks (workout, reading, coding, etc.)
* Surprise/hidden quests (e.g., system design instead of DSA)
* Optional weekend-only tasks like guitar practice

### 🧠 Stats System

* Attributes: Discipline, Strength, Focus, Health
* XP tracking, levels, and streak multipliers
* Negative XP for bad habits (junk food, skipped routines)

### ⚔️ Combos & Penalties

* Positive combos for consistent behavior
* Negative combos for repeating harmful actions
* Stat debuffs for repeated failures

### 🧩 Quest Engine

* Core quests: recurring daily goals
* Random quests: rare triggers to break monotony
* Emergency quests: real-life critical events or deviations

### 🏆 Rewards & Progression

* XP-based level system
* Unlockables: badges, streak bonuses, stat boosts
* Visualization: graphs, meters, level bars

## Tech Stack

### Frontend

* **Framework**: React with TypeScript
* **State Management**: Context API + useReducer
* **Styling**: Tailwind CSS + Framer Motion for animation
* **UI**: Modular components, dark mode, mobile-first design

### Persistence

* LocalStorage for data retention
* (Planned) Firebase or Supabase for cloud sync

### Optional Integrations

* AI-based quest generator (future enhancement)
* API for goal syncing from other services (Google Fit, GitHub, etc.)

## File/Folder Structure

```
/src
  /components
  /context
  /reducers
  /hooks
  /utils
  /types
  App.tsx
  index.tsx
```

## Context & Reducer Setup (Summary)

* Context holds global state: XP, levels, stats, quests
* Reducer manages actions like COMPLETE\_QUEST, ADD\_XP, TRIGGER\_COMBO
* Typed with TypeScript for predictability

## AI Integration (Future Scope)

* AI layer to dynamically generate quests based on user's streaks and fatigue
* Suggest quests using user's mood, activity logs, and goals
* GPT-style prompts for journaling, reflection, and reward triggers

## Design Principles

* **Minimal UI**: Dashboard-first design with XP bars, quest list, and streak meter
* **Gamified Feedback**: Audio-visual cues on completion/failure
* **Mobile Priority**: Optimized for persistent mobile use

## Roadmap

### Phase 1: MVP

* Core quest logging, XP, and stat tracking
* LocalStorage persistence
* Responsive UI

### Phase 2: Advanced Game Mechanics

* Combos, penalties, and negative feedback loop
* Surprise and emergency quest triggers
* Level-up system with unlockable features

### Phase 3: AI & Backend

* AI quest generator
* Cloud sync and multi-device support
* Social layer for comparing streaks or challenges

## Contributions Wanted

Looking for developers and designers to help with:

* UX/UI Design (gamified layouts, visual feedback)
* Frontend state and animation work
* AI integrations or journaling features
* Backend or database setup (if moving beyond localStorage)

## Presentation Use

This document is intended to give collaborators, designers, and developers a clear picture of what Redo is, why it was created, and how they can contribute. Everything from ideation to technical execution is covered except sensitive/private elements.

---

> "Level up in real life. One quest at a time."
