from __future__ import annotations

from typing import Union

from pydantic import BaseModel
import time


class FileList(BaseModel):
    username: str = None
    current_path: Union[str, list[str]]
    time: float = time.time()


class Create(BaseModel):
    username: str = None
    name: str
    current_path: str
    dir: bool
    time: float = time.time()


class CurrentPath(BaseModel):
    username: str = None
    name: str
    time: float = time.time()


class Download(BaseModel):
    username: str = None
    current_path: str
    name: str
    dir: bool
