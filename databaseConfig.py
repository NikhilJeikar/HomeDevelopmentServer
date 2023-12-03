Indexes = {
    "Account": "account",
    "Session": "session",
    "Files": "files",
    "Shared": "shared",
    "Photos": "photos",
    "Faces": "faces"
}

Mapping = {
    "Account": {"properties": {
        "username": {"type": "keyword"},
        "password": {"type": "text"},
        "privilege": {"type": "nested", "properties": {
            "path": {"type": "keyword"}
        }},
        "configuration": {"type": "nested", "properties": {
            "path": {"type": "keyword"}
        }},
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
    "Photos": {"properties": {
        "username": {"type": "keyword"},
        "photo": {"type": "nested", "properties": {
            "path": {"type": "text"},
            "is_photo": {"type": "boolean"},
            "faces": {"type": "nested", "properties": {
                "face_x1": {"type": "double"},
                "face_x2": {"type": "double"},
                "face_y1": {"type": "double"},
                "face_y2": {"type": "double"},
                "id": {"type": "keyword"},
            }},
            "comments": {"type": "nested", "properties": {
                "username": {"type": "keyword"},
                "comment": {"type": "text"},
                "commented_at": {"type": "double"},
            }},
            "width": {"type": "double"},
            "height": {"type": "double"},
            "edit": {"type": "boolean"},
            "updated_at": {"type": "double"},
            "created_at": {"type": "double"},
        }}
    }},
    "Faces": {"properties": {
        "id": {"type": "keyword"},
        "name": {"type": "keyword"},
        "hidden": {"type": "boolean"},
        "face_x1": {"type": "double"},
        "face_x2": {"type": "double"},
        "face_y1": {"type": "double"},
        "face_y2": {"type": "double"},
        "default_pic_path": {"type": "text"},
    }}
}
