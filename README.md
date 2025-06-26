# 📊 RPG Life Game Webapp - Screen & Feature Planning for Design

This document outlines the full list of **screens**, **components**, and **features** for the gamified life system webapp. It is structured for planning with your **UI/UX designer** and can also act as the base for sprint tasks.

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
|11 | `/character`          | Full personal character sheet with traits, bio, addictions, goals       | High     | TODO   |

---

## 📈 System Modules & Features

### 🏋️ Stats + XP Engine
- Show stat progress bars (STR, INT, DEX, etc.)
- XP system (global + per stat)
- Stat cap increase on level-up
- Redux slice + UI integration

### ️⃣ Quest Tracking System
- Daily Core Quests (workout, wake early, etc.)
- Optional Quests (writing, music)
- Completed/Skipped toggle
- Auto-reset daily

### ⚡ Combo Detection System
- Real-time combo logic (checklist + bonus XP)
- Display visual combo log + XP gain popup

### ❌ Penalty System
- Negative XP or stat penalties
- Missed quests tracked by type
- Combo breakdown of bad behavior

### ✨ Leveling & Rewards
- XP bar animation
- Modal with level-up reward choices
- Cap increase or theme unlock

### 🚫 Gooning + Junk Food Monitor
- Custom penalties for porn/food addiction
- Negative combo detection

### 🎿 Surprise Quest Engine
- RNG-based event triggering
- Popup modal with time-limited quest
- Accept/Decline logic with effects

### 🌍 Persistent Logging
- Quest history
- Weekly charts (XP, streaks, stat gain)
- Log-based animation (sliding progress per day)

### 🎨 UI Theming
- Light/Dark + unlockable themes
- Level-based unlock system
- Optional framer-motion transitions

### 🧠 Character Sheet Expansion
- Traits panel: age, height, weight, addictions, goals, skills
- Status effects: active buffs, debuffs, passives (based on JSON data)
- Bio summary: auto-generated character profile from biodata
- Financial progress (net worth, income)
- Relationship status section
- Achievements section: streaks, skill progression, job switch goals
- Weekly stat preview: sparklines or mini bar graphs
- Tooltips showing XP change reasons per stat
- Quick links to Combo or Penalty Logs

### 📁 Character Data Source
- Static data file: `assets/initialData/biodata.json`
- Redux slice: `store/slices/biodataSlice.ts`
- Types: extended in `types.ts` (interface Biodata)
- UI components: `BioSummary.tsx`, `TraitsPanel.tsx`
- Strict adherence to non-feature folder structure

---

## 🪺 Suggested Wireframe Flow

1. **Login/Register Screen** → email/pass + welcome intro
2. **Dashboard (Main HUD)** → stat bars, daily quests, XP bar
3. **Quest Modal** → tap each quest to complete + see XP
4. **Combo Popup** → animation + bonus XP
5. **Penalty Alert** → red glow or popup for bad habits
6. **Level-Up Modal** → select cap upgrade or cosmetic
7. **History Graphs** → XP gain and stat growth over time
8. **Character Sheet** → Display expanded traits, bio, XP reasons, history

---

## 🔄 Design Checklist by Component

| Component         | Description                                         | Status |
|------------------|-----------------------------------------------------|--------|
| XP Progress Bar  | Gamified, animated level system                     | TODO   |
| Stat Grid        | Colored bars for STR, INT, etc.                     | TODO   |
| Quest List UI    | Cards with checkboxes, icons, XP values             | TODO   |
| Combo Tracker    | Popup/scrollable combo feed with FX                 | TODO   |
| Penalty Module   | UI for stat loss, warnings, combos                  | TODO   |
| Surprise Modal   | RNG quest dialog + effect result                    | TODO   |
| Streak Calendar  | Weekly view, heatmap or icons                       | TODO   |
| Settings Panel   | Sliders for XP gain, toggle punishments             | TODO   |
| Theme Switcher   | Dark/light mode + unlockables                       | TODO   |
| Traits Panel     | Show personal traits and negative markers           | TODO   |
| Bio Summary      | Auto-description of character from state            | TODO   |
| Achievement Grid | Display unlocked milestones                         | TODO   |
| Stat History     | Weekly stat changes via sparklines                  | TODO   |
| Financial Panel  | Show income, net worth, asset breakdown             | TODO   |
| RelationshipCard | Display marriage/partner status and relevant notes  | TODO   |

---

## 🏋️ Estimated Sprint Milestones

| Sprint | Goal                                      | Includes Pages                      |
|--------|-------------------------------------------|-------------------------------------|
| 1      | Auth + Base Layout + Tailwind Setup       | `/auth`, `/dashboard`, layout.tsx   |
| 2      | Quest System + Stat Engine                | `/quests`, `/stats`, Redux setup    |
| 3      | XP + Level + Combo Engine                 | `/level-up`, `/combos`, XP bar UI   |
| 4      | Surprise + Penalty + Weekly History       | `/surprise`, `/penalties`, history  |
| 5      | Character Sheet Expansion + Bio + Traits  | `/character`, bio, traits, effects  |
| 6      | Final polish + Theming + Persistence      | `/settings`, `/profile`, localSync  |

---

> Use this as a roadmap for your designer + frontend dev handoff.
> Each page should be modular and responsive for future mobile app conversion (React Native / PWA).
