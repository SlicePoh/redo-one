import uuid

class UserDB:
    users = {}
    @classmethod
    def create_user(cls, name, email, password):
        user_id = str(uuid.uuid4())
        cls.users[user_id] = {
            "id": user_id,
            "name": name,
            "email": email,
            "password": password,  # ⚠️ hash in production
            "goals": [],
            "quests": [],
            "character_sheet": {
                "stats": {
                    "Vitality": 0, "Intelligence": 0,
                    "Fortitude": 0, "Charisma": 0,
                    "Creativity": 0, "Luck": 0
                },
                "total_xp": 0,
                "level": 1,
                "statuses": []
            }
        }
        return cls.users[user_id]

    @classmethod
    def validate_login(cls, email, password):
        for u in cls.users.values():
            if u["email"] == email and u["password"] == password:
                return u
        return None

    @classmethod
    def get_user(cls, user_id):
        return cls.users.get(user_id)

    @classmethod
    def update_character_sheet(cls, user_id, updates):
        if user_id not in cls.users:
            return None
        cls.users[user_id]["character_sheet"].update(updates)
        return cls.users[user_id]

    @classmethod
    def update_goals(cls, user_id, goals):
        if user_id not in cls.users:
            return None
        cls.users[user_id]["goals"] = goals
        return cls.users[user_id]

    @classmethod
    def add_quest(cls, user_id, quest):
        if user_id not in cls.users:
            return None
        quest["id"] = str(uuid.uuid4())
        cls.users[user_id]["quests"].append(quest)
        return cls.users[user_id]

    @classmethod
    def update_quest(cls, user_id, quest_id, updates):
        if user_id not in cls.users:
            return None
        for q in cls.users[user_id]["quests"]:
            if q["id"] == quest_id:
                q.update(updates)
                return cls.users[user_id]
        return None

    @classmethod
    def delete_quest(cls, user_id, quest_id):
        if user_id not in cls.users:
            return None
        quests = cls.users[user_id]["quests"]
        cls.users[user_id]["quests"] = [q for q in quests if q["id"] != quest_id]
        return cls.users[user_id]
