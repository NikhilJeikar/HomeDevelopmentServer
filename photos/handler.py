import io
import os.path
from time import time
from elasticsearch import Elasticsearch
from starlette.responses import StreamingResponse

from config import Elastic_URL, FTP_BASE_PATH, Elastic_Username, Elastic_Password
from databaseConfig import Indexes, Mapping
from photos.core import FaceDetection
import cv2


class FaceHandler:
    def __init__(self, username, es_username, es_password):
        self.__Index = "Faces"
        self.__username = username
        self.__es_username = es_username
        self.__es_password = es_password
        self.__ES = Elasticsearch(hosts=Elastic_URL,
                                  http_auth=(self.__es_username, self.__es_password))
        self._CreateIndex()

    def _GetIndex(self):
        return Indexes[self.__Index] + '-' + self.__username

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=self._GetIndex()):
            self.__ES.indices.create(index=self._GetIndex(), mappings=Mapping[self.__Index])

    def AddFace(self, user_id: str, path: str, x1: float, x2: float, y1: float, y2: float):
        if not self.__ES.exists(index=self._GetIndex(), id=user_id):
            self.__ES.create(index=self._GetIndex(), id=user_id, document={
                "id": user_id,
                "default_pic_path": path,
                "name": "Unknown",
                "face_x1": x1,
                "face_x2": x2,
                "face_y1": y1,
                "face_y2": y2,
                "hidden": False
            })

    def SetName(self, user_id: str, name: str):
        if self.__ES.exists(index=self._GetIndex(), id=user_id):
            self.__ES.update(index=self._GetIndex(), id=user_id, refresh=True,
                             body={'doc': {"name": name}})
            return {"status": True}
        return {"status": False}

    def SetVisibility(self, user_id: str, hide: bool):
        if self.__ES.exists(index=self._GetIndex(), id=user_id):
            self.__ES.update(index=self._GetIndex(), id=user_id, refresh=True,
                             body={'doc': {"hidden": hide}})
            return {"status": True}
        return {"status": False}

    def GetFaces(self):
        results = self.__ES.search(index=self._GetIndex(), query={"bool": {
            "should": [
                {
                    "match": {
                        "hidden": False
                    }
                }
            ]
        }})
        return [i["_source"] for i in results["hits"]["hits"]]

    def GetFace(self, user_id):
        return self.__ES.get(index=self._GetIndex(), id=user_id)


class PhotosHandler:
    def __init__(self, username, es_username, es_password):
        self.__Index = "Photos"
        self.__username = username
        self.__es_username = es_username
        self.__es_password = es_password
        self.__ES = Elasticsearch(hosts=Elastic_URL,
                                  http_auth=(self.__es_username, self.__es_password))
        self._CreateIndex()
        self.__FaceHandle = FaceHandler(username, es_username, es_password)
        self.__FTPBasePath = FTP_BASE_PATH

    def _GetIndex(self):
        return Indexes[self.__Index] + '-' + self.__username

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=self._GetIndex()):
            self.__ES.indices.create(index=self._GetIndex(), mappings=Mapping[self.__Index])

    def AddFile(self, path: str, time: float):
        if path.endswith(".jpg") or path.endswith(".jpeg") or path.endswith(".png"):
            detect = FaceDetection(self.__username, path)
            height, width = detect.GetDimension()
            path = path.replace(os.path.join(self.__FTPBasePath, self.__username), "")
            path = os.path.sep.join(
                [i for i in path.split(os.path.sep) if i != "." and i != "" and i != ".."])
            face_data = detect.AnalysisImage()
            data = {
                "username": self.__username,
                "photo": {
                    "path": path,
                    "is_photo": True,
                    "faces": [],
                    "updated_at": time,
                    "height": height,
                    "width": width
                }}
            for key, value in face_data.items():
                data["photo"]["faces"].append({
                    "face_x1": value["face_x1"],
                    "face_x2": value["face_x2"],
                    "face_y1": value["face_y1"],
                    "face_y2": value["face_y2"],
                    "id": key,
                })
                self.__FaceHandle.AddFace(key, path, value["face_x1"], value["face_x2"],
                                          value["face_y1"], value["face_y2"])
            if self.__ES.exists(index=self._GetIndex(), id=path):
                self.__ES.update(index=self._GetIndex(), id=path, refresh=True,
                                 body={'doc': data})
            else:
                data['photo']['created_at'] = time
                self.__ES.create(index=self._GetIndex(), id=path, document=data)

    def DeleteFile(self, path: str):
        path = os.path.join(os.path.join(self.__FTPBasePath, self.__username), path)
        if self.__ES.exists(index=self._GetIndex(), id=path):
            self.__ES.delete(index=self._GetIndex(), id=path)

    def GetFileDetails(self, path: str):
        path = os.path.join(os.path.join(self.__FTPBasePath, self.__username), path)
        if self.__ES.exists(index=self._GetIndex(), id=path):
            return self.__ES.get(index=self._GetIndex(), id=path)

    def GetThumbnail(self, path: str):
        path = os.path.join(os.path.join(self.__FTPBasePath, self.__username), path)
        img = cv2.imread(path)
        height, width = img.shape[:2]
        aspect_ratio = height / width
        res, im_png = cv2.imencode(".jpeg", cv2.resize(img, (
            int(256), int(256 * aspect_ratio)), ))
        return StreamingResponse(io.BytesIO(im_png.tobytes()), media_type="image/jpeg")

    def GetPhoto(self, path: str):
        path = os.path.join(os.path.join(self.__FTPBasePath, self.__username), path)
        img = cv2.imread(path)
        res, im_png = cv2.imencode(".jpeg", img)
        return StreamingResponse(io.BytesIO(im_png.tobytes()), media_type="image/jpeg")

    def GetFace(self, path: str, x1: int, x2: int, y1: int, y2: int):
        path = os.path.join(os.path.join(self.__FTPBasePath, self.__username), path)
        img = cv2.imread(path)
        res, im_png = cv2.imencode(".jpeg", img[int(y2):int(y1), int(x1):int(x2)])
        return StreamingResponse(io.BytesIO(im_png.tobytes()), media_type="image/jpeg")

    def PhotoList(self, data):
        if len(data) != 0:
            query = {"nested": {
                "path": "photo",
                "query": {
                    "nested": {
                        "path": "photo.faces",
                        "query": {
                            "bool": {
                                "should": [
                                    {
                                        "match": {
                                            "photo.faces.id": i
                                        }
                                    }
                                    for i in data
                                ]
                            }
                        }
                    }
                }
            }
            }
        else:
            query = {"match_all": {}}
        results = self.__ES.search(index=self._GetIndex(), size=10000, query=query)
        return [i["_source"] for i in results["hits"]["hits"]]


def Trigger(event, path):
    username = [i for i in path.replace(FTP_BASE_PATH, "").split(os.path.sep) if
                len(i) != 0 and i != ".." and i != "."][0]
    photoHandler = PhotosHandler(username, Elastic_Username, Elastic_Password)
    photoHandler.AddFile(path, time())
