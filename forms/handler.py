from elasticsearch import Elasticsearch


from config import Elastic_URL
from database_config import Mapping, Indexes


class FormsHandler:
    def __init__(self, username, es_username, es_password):
        self.__Index = "Forms"
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

    def CreateForm(self):
        pass


class ResponseHandler:
    def __init__(self, form_id, es_username, es_password):
        self.__Index = "Response"
        self.__form_id = form_id
        self.__es_username = es_username
        self.__es_password = es_password
        self.__ES = Elasticsearch(hosts=Elastic_URL,
                                  http_auth=(self.__es_username, self.__es_password))
        self._CreateIndex()

    def _GetIndex(self):
        return Indexes[self.__Index] + '-' + self.__form_id

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=self._GetIndex()):
            self.__ES.indices.create(index=self._GetIndex(), mappings=Mapping[self.__Index])
