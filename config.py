from dotenv import load_dotenv
import os
load_dotenv()

Elastic_URL = "http"
Elastic_Username = 'elastic'
Elastic_Password = os.getenv("ELASTIC_PASSWORD", "qwerty")

FTP_BASE_PATH = "."
