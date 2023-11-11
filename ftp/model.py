from __future__ import annotations

from typing import Union

from pydantic import BaseModel
import time


class FileList(BaseModel):
    username: str
    session_id: str
    current_path: Union[str, list[str]]
    time: float = time.time()


class Create(BaseModel):
    username: str
    session_id: str
    name: str
    current_path: str
    dir: bool
    time: float = time.time()


class CurrentPath(BaseModel):
    username: str
    session_id: str
    name: str
    time: float = time.time()


class Download(BaseModel):
    username: str
    current_path: str
    name: str
    dir:bool
