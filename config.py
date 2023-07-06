import configparser

config = configparser.ConfigParser()
config.read('config.ini')

Elastic_Username = config['ELASTIC']['user']
Elastic_Password = config['ELASTIC']['password']

Sync_Path = config['SYNC']['base_path']

Security_Key = config['SECURITY']['secret']
Security_Algo = config['SECURITY']['algorithm']

Indexes = {
    "Account": "account",
    "Sync": "sync"
}

Mapping = {
    "Account": {"properties": {
        "username": {"type": "keyword"},
        "password": {"type": "text"},
        "privilege": {"type": "object"}
    }},
    "Sync": {"properties": {
        "username": {"type": "keyword"},
        "device_id": {"type": "number"},
        "device_name": {"type": "keyword"},
        "time": {"type": "double"}
    }},
    "Log": {"properties": {
        "Component": {"type": "keyword"},
        "Level": {"type": "number"},
        "time": {"type": "double"}
    }}
}
