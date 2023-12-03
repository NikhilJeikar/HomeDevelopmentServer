import face_recognition
import numpy as np
import uuid
import os
import json
from config import PHOTOS_BASE_PATH


class FaceDetection:
    def __init__(self, username, path: str):
        self.__BasePath = PHOTOS_BASE_PATH
        self.__Username = None
        self.__KnownFaces = {}
        self.__image = face_recognition.load_image_file(path)
        self.__path = path
        self.__Username = username
        self.__CreateDir()

    def __CreateDir(self):
        os.makedirs(os.path.join(self.__BasePath, self.__Username), exist_ok=True)

    def __SaveFace(self, user_id, weights):
        np.save(os.path.join(os.path.join(self.__BasePath, self.__Username), user_id), weights,
                True)

    def __PopulateEncoding(self):
        self.__KnownFaces = {}
        for root, dirs, files in os.walk(os.path.join(self.__BasePath, self.__Username)):
            for file in files:
                if file.endswith(".npy"):
                    self.__KnownFaces[file.replace(".npy", "")] = np.load(os.path.join(root, file))

    def GetDimension(self):
        return self.__image.shape[:2]

    def AnalysisImage(self):
        face_locations = face_recognition.face_locations(self.__image)
        face_encodings = face_recognition.face_encodings(self.__image, face_locations)
        Faces = {}
        self.__PopulateEncoding()
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

            matches = face_recognition.compare_faces(list(self.__KnownFaces.values()),
                                                     face_encoding,
                                                     tolerance=0.5)
            name = uuid.uuid4().hex
            if len(list(self.__KnownFaces.values())) != 0:
                face_distances = face_recognition.face_distance(list(self.__KnownFaces.values()),
                                                                face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = list(self.__KnownFaces.keys())[best_match_index]
                else:
                    self.__SaveFace(name, face_encoding)
            else:
                self.__SaveFace(name, face_encoding)

            Faces[name] = {"face_x1": left,
                           "face_x2": right,
                           "face_y1": bottom,
                           "face_y2": top}
        return Faces
