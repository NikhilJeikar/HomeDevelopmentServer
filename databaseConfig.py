Indexes = {
    "Account": "account",
    "Session": "session",
    "Files": "files",
    "Shared": "shared"
}

Mapping = {
    "Account": {"properties": {
        "username": {"type": "keyword"},
        "password": {"type": "text"},
        "privilege": {"type": "object"}
    }},
    "Session": {"properties": {
        "username": {"type": "keyword"},
        "session_token": {"type": "text"},
        "time": {"type": "double"},
        "valid": {"type": "boolean"},
    }},
    "Log": {"properties": {
        "Component": {"type": "keyword"},
        "Level": {"type": "keyword"},
        "time": {"type": "double"}
    }},
    "Files": {"properties": {
        "File": {"type": "keyword"},
        "Path": {"type": "text"},
        "Shared": {"type": "integer"},
        "Author": {"type": "keyword"},
        "created": {"type": "double"},
        "modified": {"type": "double"},
    }},
    "Shared": {"properties": {
        "path": {"type": "text"},
        "linkParam": {"type": "text"},
        "username": {"type": "keyword"},
        "read": {"type": "boolean"},
        "edit": {"type": "boolean"},
        "open_time": {"type": "double"},
        "close_time": {"type": "double"},
        "valid": {"type": "boolean"},
    }},
}
