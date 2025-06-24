# Requirements for RPG Life Web App

Maintain these coding rules throughout the codebase to ensure consistency, readability, and scalability.

---

## 1. 🧠 General Principles

- Follow modular, clean, scalable, and testable coding practices.
- Use TypeScript with strict types for all logic and data models.
- Structure your folders non-feature-based (see `src/` for reference).
- Use centralized Redux slices under `store/slices/`.
- Keep reusable logic and hooks in `hooks/` and shared UI in `components/shared/`.

---

## 2. 🎨 Styling Rules

- All custom styling must be centralized in `src/assets/style.ts`.
- Reuse and compose Tailwind classNames from this file — **do not inline custom styles**.

```ts
// ✅ GOOD (inside style.ts)
export const heading = "text-xl font-bold tracking-wide";

// ❌ BAD (directly in JSX)
<h1 className="text-xl font-bold tracking-wide">Hello</h1>
```

---

## 3. 🤖 CoPilot Agent Mode

- For any Copilot-generated or AI-assisted code, use:

```tsx
// ==== CoPilot Code START ====

// ... generated code ...

// ==== CoPilot Code END ====
```

- Do **not** wrap manually written code in those comments.

---

## 4. 🗂 Folder Structure

Maintain this folder structure:

```
src/
├── assets/
│   ├── initialData/
│   │   ├── effects.json
│   │   ├── quests.json
│   │   └── types.json
│   ├── style.ts
│   └── types.ts
│
├── components/
│   └── shared/
│       ├── Navbar.tsx
│       └── PageWrapper.tsx
│
├── hooks/
│
├── pages/
│   ├── Character.tsx
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── QuestLog.tsx
│   └── Settings.tsx
│
├── store/
│   ├── slices/
│   │   ├── effectsSlice.ts
│   │   ├── questsSlice.ts
│   │   └── statsSlice.ts
│   └── index.ts
│
├── App.tsx
└── index.css
```

> 🛑 **Do not use feature-based folder grouping**. Keep the flat but modular layout.

---

## 5. 🧪 Testing (WIP)

- All logic modules and reducers should be covered by unit tests in `/__tests__` (to be scaffolded).
- Use vitest or jest with React Testing Library.

---

## 6. ✅ Data Rules

- Use `quests.json`, `effects.json`, and `types.json` under `initialData/` as source of truth.
- Store dynamic quest/effect state inside Redux slices (e.g., `questsSlice.ts`, `effectsSlice.ts`).
- Avoid hardcoding logic in components — always drive behavior via JSON and store.

---

## 7. ⏳ State Design Philosophy

- Game logic (penalties, bonuses, effect triggers) should be:
  - Declarative (expressed via JSON or config objects)
  - Modular (updatable without changing many files)
  - Dynamic (state/effects should be time/context sensitive)

---

Continue expanding this document as we define rules for:
- Quest resolution engine
- Combo/multiplier logic
- Status timers
- Event triggers (hidden/emergency quests)
- Data versioning and migration strategy

---

Last updated: 2025-06-23
