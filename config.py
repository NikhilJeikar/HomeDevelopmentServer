from dotenv import load_dotenv
import os
load_dotenv()

Elastic_URL = "10.0.0.2"
Elastic_Username = 'elastic'
Elastic_Password = os.getenv("ELASTIC_PASSWORD", "qwerty")

FTP_BASE_PATH = "./data"
PHOTOS_BASE_PATH = "./encodings"
