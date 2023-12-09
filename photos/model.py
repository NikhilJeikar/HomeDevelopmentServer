from typing import Union

from pydantic import BaseModel


class Rename(BaseModel):
    id: str
    name: str


class SetVisibility(BaseModel):
    id: str
    hidden: bool


class FetchDetails(BaseModel):
    id: list
