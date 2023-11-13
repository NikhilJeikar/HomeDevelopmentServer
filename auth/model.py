from pydantic import BaseModel
import time


class AccountLogin(BaseModel):
    username: str = None
    password: str
    time: float = time.time()

    def GetCredentials(self):
        return {
            "username": self.username,
            "password": self.password
        }


class ChangePassword(BaseModel):
    username: str = None
    old_password: str
    new_password: str
    time: float = time.time()
