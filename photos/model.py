from pydantic import BaseModel


class Rename(BaseModel):
    id: str
    name: str


class SetVisibility(BaseModel):
    id: str
    hidden: bool
