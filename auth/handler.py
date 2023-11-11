from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConflictError, NotFoundError

from databaseConfig import Mapping, Indexes
from auth.model import AccountLogin

import uuid
import time


class SessionHandler:
    def __init__(self, username, password):
        self.__Index = "Session"
        self.__ES = Elasticsearch(http_auth=(username, password))
        self._CreateIndex()

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=Indexes[self.__Index]):
            self.__ES.indices.create(index=Indexes[self.__Index], mappings=Mapping[self.__Index])

    def CreateSession(self, username):
        try:
            token = uuid.uuid4().hex
            self.__ES.create(index=Indexes[self.__Index], id=token,
                             document={
                                 "username": username,
                                 "session_token": token,
                                 "time": time.time(),
                                 "valid": True
                             })
            return {"status": True, "session_id": token}
        except ConflictError:
            return {"status": False}

    def ValidateSession(self, session, username):
        try:
            Out = self.__ES.get(index=Indexes[self.__Index], id=session)
            if Out["found"] and Out["_source"]["username"] == username:
                return {"status": True}
        except NotFoundError:
            return {"status": False}
        return {"status": False}

    def CloseSession(self, session):
        try:
            self.__ES.update(index=Indexes[self.__Index], id=session,
                             body={
                                 "valid": False
                             })
            return {"status": True}
        except ConflictError:
            return {"status": False}


class ElasticLoginHandler():
    def __init__(self, username, password):
        self.__Index = "Account"
        self.__username = username
        self.__password = password
        self.__ES = Elasticsearch(http_auth=(self.__username, self.__password))
        self.__SessionHandler = SessionHandler(self.__username, self.__password)
        self._CreateIndex()

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=Indexes[self.__Index]):
            self.__ES.indices.create(index=Indexes[self.__Index], mappings=Mapping[self.__Index])

    def CreateUser(self, data: AccountLogin):
        try:
            self.__ES.create(index=Indexes[self.__Index], id=data.username,
                             document=data.GetCredentials())
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def FetchUsers(self, start: int):
        page = self.__ES.search(index=Indexes[self.__Index], body={"query": {"match_all": {}}},
                                sort=["username:ASC"],
                                from_=start, size=20)
        return [i["_source"]["username"] for i in page["hits"]["hits"]]

    def LoginUser(self, data: AccountLogin):
        try:
            Out = self.__ES.get(index=Indexes[self.__Index], id=data.username)
            if Out["found"] and Out["_source"]["password"] == data.password:
                return self.__SessionHandler.CreateSession(data.username)
        except NotFoundError:
            return {"status": False}
        return {"status": False}

    def LogoutUser(self, token):
        return self.__SessionHandler.CloseSession(token)

    def UpdatePassword(self, data: AccountLogin):
        try:
            self.__ES.update(index=Indexes[self.__Index], id=data.username,
                             body={"doc": {"password": data.password}})
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def IsUser(self, username: str):
        try:
            Out = self.__ES.get(index=Indexes[self.__Index], id=username)
            return {"status": Out["found"]}
        except NotFoundError:
            return {"status": False}
