from elasticsearch import Elasticsearch

from databaseConfig import Indexes, Mapping


class PhotosHandler:
    def __init__(self, username, es_username, es_password):
        self.__Index = "Photos"
        self.__username = username
        self.__es_username = es_username
        self.__es_password = es_password
        self.__ES = Elasticsearch(http_auth=(self.__es_username, self.__es_password))
        self._CreateIndex()

    def _GetIndex(self):
        return Indexes[self.__Index] + '-' + self.__username

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=self._GetIndex()):
            self.__ES.indices.create(index=self._GetIndex(), mappings=Mapping[self.__Index])

    def AddFile(self, path):
        pass
