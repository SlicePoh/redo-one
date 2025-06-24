# 📊 RPG Life Game Webapp - Screen & Feature Planning for Design

This document outlines the full list of **screens**, **components**, and **features** for the gamified life system webapp. It is structured for planning with your **UI/UX designer** and can also act as the base for sprint tasks.

---

## 📁 Folder Structure Rules

- ❌ No feature-based folder structure.
- ✅ Maintain a structure like:
  - `src/assets/initialData` → static JSON files (quests, effects, types)
  - `src/assets/style.ts` → reusable tailwind styles
  - `src/components/shared/` → reusable UI components like Navbar
  - `src/pages/` → top-level route components like Dashboard, Quests, History
  - `src/store/slices` → Redux slices for effects, stats, quests, etc.
  - `src/hooks/` → custom React hooks

---

## 📖 Core Screens (Pages)

| # | Route / Page         | Description                                                              | Priority | Status |
|---|-----------------------|--------------------------------------------------------------------------|----------|--------|
| 1 | `/dashboard`          | Main HUD. Shows player level, XP bar, stat progress, today’s quests     | High     | TODO   |
| 2 | `/quests`             | Complete and log daily/optional/surprise quests                         | High     | TODO   |
| 3 | `/stats`              | Detailed stat screen: STR, INT, DISC, etc. with progression bars        | Medium   | TODO   |
| 4 | `/combos`             | Show triggered combos and earned XP bonuses                             | Medium   | TODO   |
| 5 | `/penalties`          | Display negative outcomes from bad habits (losses, stat penalties)      | Medium   | TODO   |
| 6 | `/level-up`           | Modal/page shown when player levels up, reward selection UI             | High     | TODO   |
| 7 | `/surprise`           | Random quest popup/modal triggered by LUK stat                          | Medium   | TODO   |
| 8 | `/settings`           | Configure quest XP, stat caps, streak rules, theme toggles              | Low      | TODO   |
| 9 | `/profile`            | User info, streaks, level history, toggle dark mode                     | Medium   | TODO   |
|10 | `/auth`               | Login/Register flow (email/password or Firebase Auth)                   | High     | TODO   |

---

## 📈 System Modules & Features

### 🏋️ Stats + XP Engine
- Stat types: STR, INT, DISC, DEX, CHA, LUK
- XP system (global + per stat)
- Scaling XP based on partial completion of quests
- Stat cap increase on level-up
- Redux slice integration (see `store/slices/statsSlice.ts`)

### 🔢 Quest Tracking System
- Daily, optional, surprise quests
- Scaling XP based on effort/time percentages
- Combo-based XP rewards
- Partial scoring + auto reset daily

### ⚡ Combo Detection System
- Status effect detection using `effects.json`
- Triggers when multiple quest outcomes align
- Applies buffs or penalties
- Real-time UI update

### ❌ Penalty System
- Tracked by failed quests marked with `penalty: true`
- Applies stat penalties + visual effects
- Logged with timestamps in Redux + history

### 🌟 Leveling & Rewards
- XP progress and level-up UI
- Level-up screen with stat cap choices
- Unlock streak-based themes or abilities

### 🚫 Gooning + Junk Food Monitor
- Specific quests (e.g., "No Gooning", "Avoid Junk Food")
- Auto-detect penalties and mark effects
- Tracks streaks, combos, and failures

### 🎡 Surprise Quest Engine
- RNG-triggered quest popups
- Based on LUK stat or surprise system logic
- Accept/decline logic affects XP and stats

### 🌍 Persistent Logging
- Redux state syncing with localStorage
- Weekly charts for XP and stat gains
- Scrollable log of completed/skipped quests

### 🎨 UI Theming
- Light/Dark theme toggles
- Level-based unlockable themes
- Uses `style.ts` to manage Tailwind presets

---

## 🛋️ Suggested Wireframe Flow

1. **Login/Register Screen** → email/pass + welcome intro
2. **Dashboard (Main HUD)** → stat bars, daily quests, XP bar
3. **Quest Modal** → tap each quest to complete + see XP
4. **Combo Popup** → animation + bonus XP
5. **Penalty Alert** → red glow or popup for bad habits
6. **Level-Up Modal** → select cap upgrade or cosmetic
7. **History Graphs** → XP gain and stat growth over time

---

## 🔄 Design Checklist by Component

| Component         | Description                                 | Status |
|------------------|---------------------------------------------|--------|
| XP Progress Bar  | Gamified, animated level system             | TODO   |
| Stat Grid        | Colored bars for STR, INT, etc.             | TODO   |
| Quest List UI    | Cards with checkboxes, icons, XP values     | TODO   |
| Combo Tracker    | Popup/scrollable combo feed with FX         | TODO   |
| Penalty Module   | UI for stat loss, warnings, combos          | TODO   |
| Surprise Modal   | RNG quest dialog + effect result            | TODO   |
| Streak Calendar  | Weekly view, heatmap or icons               | TODO   |
| Settings Panel   | Sliders for XP gain, toggle punishments     | TODO   |
| Theme Switcher   | Dark/light mode + unlockables               | TODO   |

---

## 🏋️ Estimated Sprint Milestones

| Sprint | Goal                                      | Includes Pages                      |
|--------|-------------------------------------------|-------------------------------------|
| 1      | Auth + Base Layout + Tailwind Setup       | `/auth`, `/dashboard`, layout.tsx   |
| 2      | Quest System + Stat Engine                | `/quests`, `/stats`, Redux setup    |
| 3      | XP + Level + Combo Engine                 | `/level-up`, `/combos`, XP bar UI   |
| 4      | Surprise + Penalty + Weekly History       | `/surprise`, `/penalties`, history  |
| 5      | Final polish + Theming + Persistence      | `/settings`, `/profile`, localSync  |

---

> Use this as a roadmap for your designer + frontend dev handoff.
> Each page should be modular and responsive for future mobile app conversion (React Native / PWA).
> Copilot Agent Mode should follow all constraints in `requirements.md` strictly.
