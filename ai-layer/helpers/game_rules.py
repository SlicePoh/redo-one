# ==============================
# Structured Rules (for logic)
# ==============================

# XP by difficulty
XP_BY_DIFFICULTY = {
    "Easy": 20,
    "Medium": 50,
    "Hard": 100,
    "Legendary": 200,
}

# Stats list
STATS = [
    "Vitality",      # Physical strength & wellness
    "Intelligence",  # Mental skills & learning
    "Fortitude",     # Emotional resilience & discipline
    "Charisma",      # Social skills & confidence
    "Creativity",    # Artistic & imaginative output
    "Luck",          # Game-driven randomness
]

# Status effects
STATUS_EFFECTS = {
    "Momentum": {
        "type": "positive",
        "effect": "+20% XP from all quests",
        "duration_days": 3,
    },
    "Flow State": {
        "type": "positive",
        "effect": "+50% XP for one stat",
        "duration_days": 1,
    },
    "Luck Surge": {
        "type": "positive",
        "effect": "+1 random bonus quest daily",
        "duration_days": 1,
    },
    "Slump": {
        "type": "negative",
        "effect": "-30% XP from all quests",
        "duration_days": 3,
    },
    "Injury": {
        "type": "negative",
        "effect": "Disables Vitality quests",
        "duration_days": None,  # variable
    },
    "Burnout": {
        "type": "negative",
        "effect": "-50% XP for mental stats",
        "duration_days": 2,
    },
}

# Penalties
PENALTIES = {
    "missed_quest": "Lose 50% XP for tagged stats",
    "missed_streak_day": "Lose streak bonus & -10% XP next day",
    "failed_quests_week": "3+ failed quests/week → Slump",
}

# Bonuses
BONUSES = {
    "daily_streak": "+5% XP/day (max 50%)",
    "stat_combo": "≥3 quests for same stat/day → +20% XP next day for that stat",
    "variety_bonus": "≥1 quest for each stat/week → +500 global XP",
}

# XP progression formula
def xp_needed(level: int) -> int:
    """XP required for next level."""
    return int(100 * (level ** 1.5))

def global_level(total_xp: int) -> int:
    """Global character level."""
    return total_xp // 500

# ==============================
# LLM Prompt Rules (as text)
# ==============================

GAME_RULES = f"""
Stats: {", ".join(STATS)}.
Each quest: 1-3 tagged stats; XP split evenly.
Difficulty → XP: {XP_BY_DIFFICULTY}.
XP_needed(level) = 100 * level^1.5. Global level = floor(totalXP/500).
Statuses: {", ".join(STATUS_EFFECTS.keys())}.
Penalties: {PENALTIES}.
Bonuses: {BONUSES}.
Goal progression: Based on linked stats' average level %, with milestone rewards.
"""
