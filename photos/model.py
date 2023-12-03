from pydantic import BaseModel


class Rename(BaseModel):
    id: str
    name: str
