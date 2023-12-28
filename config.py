from dotenv import load_dotenv
import os
load_dotenv()

Elastic_URL = "192.168.0.118"
Elastic_Username = 'elastic'
Elastic_Password = os.getenv("ELASTIC_PASSWORD", "qwerty")

FTP_BASE_PATH = "./data"
PHOTOS_BASE_PATH = "./encodings"
CACHE_BASE_PATH = "./cache"
