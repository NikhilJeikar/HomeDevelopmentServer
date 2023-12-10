from __future__ import annotations

from typing import Union, List

from pydantic import BaseModel
import time


class FileList(BaseModel):
    username: str = None
    current_path: Union[str, List[str]]
    time: float = time.time()


class Create(BaseModel):
    username: str = None
    name: str = None
    current_path: str
    dir: bool = False
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


class CreateShared(BaseModel):
    path: str
    linkParam: str = None
    username: str = None
    read: bool
    edit: bool
    valid: bool = True
    open_time: float = None
    close_time: float = None
