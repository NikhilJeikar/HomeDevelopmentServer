from elasticsearch import Elasticsearch

from elasticsearch.exceptions import ConflictError, NotFoundError
from fastapi import UploadFile

from RequestModel import AccountLogin, CreateSyncDeviceEntry
from config import Indexes, Mapping

import os
import shutil


class ElasticLoginHandler:
    def __init__(self, username, password):
        self._Index = "Account"
        self._ES = Elasticsearch(http_auth=(username, password))
        self.CreateIndex()

    def CreateIndex(self):
        if not self._ES.indices.exists(index=Indexes[self._Index]):
            self._ES.indices.create(index=Indexes[self._Index], mappings=Mapping[self._Index])

    def CreateUser(self, data: AccountLogin):
        try:
            self._ES.create(index=Indexes[self._Index], id=data.username, document=data.GetCredentials())
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def FetchUsers(self, start: int):
        page = self._ES.search(index=Indexes[self._Index], body={"query": {"match_all": {}}}, sort=["username:ASC"],
                               from_=start, size=20)
        return [i["_source"]["username"] for i in page["hits"]["hits"]]

    def LoginUser(self, data: AccountLogin):
        try:
            Out = self._ES.get(index=Indexes[self._Index], id=data.username)
            if Out["found"] and Out["_source"]["password"] == data.password:
                return {"status": True}
        except NotFoundError:
            return {"status": False}
        return {"status": False}

    def UpdatePassword(self, data: AccountLogin):
        try:
            self._ES.update(index=Indexes[self._Index], id=data.username, body={"doc": {"password": data.password}})
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def IsUser(self, username: str):
        try:
            Out = self._ES.get(index=Indexes[self._Index], id=username)
            return {"status": Out["found"]}
        except NotFoundError:
            return {"status": False}


class SyncHandler:
    def __init__(self, username, password, BasePath):
        self._Index = "Sync"
        self._ES = Elasticsearch(http_auth=(username, password))
        self._Basepath = BasePath
        self.CreateIndex()

    def CreateIndex(self):
        if not self._ES.indices.exists(index=Indexes[self._Index]):
            self._ES.indices.create(index=Indexes[self._Index], mappings=Mapping[self._Index])

    def FetchRecord(self, start: int):
        page = self._ES.search(index=Indexes[self._Index], body={"query": {"match_all": {}}}, sort=["time:DESC"],
                               from_=start, size=20)
        return [i["_source"]["username"] for i in page["hits"]["hits"]]

    def FetchRecordBy(self, start: int, condition: dict, sort: dict):
        SortCondition = "time:DESC"
        if sort is not None:
            List = []
            for key, value in sort.items():
                List.append(f"{key}:{value}")
            SortCondition = ",".join(List)
        page = self._ES.search(index=Indexes[self._Index], query={"match": condition}, sort=[SortCondition],
                               from_=start, size=20)

        return [i["_source"]["username"] for i in page["hits"]["hits"]]

    def CreateFolder(self, device: str, relative_path: str, name: str):
        os.mkdir(os.path.join(os.path.join(os.path.join(self._Basepath, device), relative_path), name))

    def GetPath(self, device: str, relative_path: str):
        return os.path.join(os.path.join(self._Basepath, device), relative_path)

    def CreateDevice(self, data: CreateSyncDeviceEntry):
        try:
            self._ES.create(index=Indexes[self._Index], id=data.device_id, document=data.dict())
            os.mkdir(os.path.join(self._Basepath, data.device_id))
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def UpdateDeviceName(self, data: CreateSyncDeviceEntry):
        try:
            self._ES.update(index=Indexes[self._Index], id=data.device_id,
                            body={"doc": {"device_name": data.device_name}})
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def CreateFile(self, device: str, relative_path: str, file: UploadFile):
        path = os.path.join(self.GetPath(device, relative_path), file.filename)
        with open(path, "wb") as file_IO:
            shutil.copyfileobj(file.file, file_IO)
        file_IO.close()

    def GetFile(self, device: str, relative_path: str):
        res = None
        with open(self.GetPath(device, relative_path), "rb") as file_IO:
            res = file_IO.read()
        file_IO.close()
        return res
