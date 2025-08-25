from datetime import datetime

def serialize(value):
  if isinstance(value, dict):
    return {k: serialize(v) for k, v in value.items()}
  if isinstance(value, list):
    return [serialize(v) for v in value]
  if isinstance(value, datetime):
    return value.isoformat()
  return value