def merge_json(original, update):
    """Merge two JSON objects, preserving existing fields."""
    for key, value in update.items():
        if key not in original or not original[key]:
            original[key] = value
        elif isinstance(value, dict) and isinstance(original[key], dict):
            merge_json(original[key], value)
    return original
