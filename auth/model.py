from pydantic import BaseModel
import time


class AccountLogin(BaseModel):
    username: str
    password: str
    time: float = time.time()

    def GetCredentials(self):
        return {
            "username": self.username,
            "password": self.password
        }

