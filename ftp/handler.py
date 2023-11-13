import time

from elasticsearch import Elasticsearch, ConflictError
from fastapi import UploadFile, File
from starlette.responses import FileResponse, StreamingResponse

import os
import zipfile
import io
import shutil
from databaseConfig import Indexes, Mapping

FTP_BASE_PATH = "."


class FileHandle:
    def __init__(self, username, es_username, es_password):
        self.__base_path = FTP_BASE_PATH
        self.__current_path = self.__base_path
        self.__username = username
        self.__CreateUserSpace()
        self.__db_handler = DBHandle(username, es_username, es_password)
        self.__current_path = os.path.join(self.__base_path, self.__username)

    @staticmethod
    def __CleanName(name):
        name = name.split(os.path.sep)
        os.path.sep.join(name[1:])
        return os.path.sep.join(name[1:])

    def __CreateUserSpace(self):
        try:
            os.mkdir(os.path.join(self.__current_path, self.__username))
        except FileExistsError:
            return {"message": "User space exist already exist"}

    def CreateFile(self, name):
        current_time = time.time()
        self.__db_handler.AddEntry({"File": name, "Path": os.path.join(self.__current_path, name),
                                    "Shared": 0, "Author": self.__username, "created": current_time,
                                    "modified": current_time})

        file = open(os.path.join(self.__current_path, name), 'w')
        file.close()

    def CreateFolder(self, name):
        try:
            current_time = time.time()
            self.__db_handler.AddEntry(
                {"File": name, "Path": os.path.join(self.__current_path, name),
                 "Shared": 0, "Author": self.__username, "created": current_time,
                 "modified": current_time})
            os.mkdir(os.path.join(self.__current_path, name))
        except FileExistsError:
            return {"message": "Folder already exist"}

    def WriteFile(self, file: UploadFile = File(...)):
        try:
            filename = os.path.join(self.__current_path, file.filename)
            current_time = time.time()
            self.__db_handler.AddEntry(
                {"File": file.filename, "Path": filename,
                 "Shared": 0, "Author": self.__username, "created": current_time,
                 "modified": current_time})
            with open(filename, 'wb') as f:
                while contents := file.file.read(1024 * 1024):
                    f.write(contents)
        except Exception as e:
            print(e)
            return {"message": "Error uploading the file"}
        finally:
            file.file.close()

    def SendFile(self, name):
        if os.path.isdir(os.path.join(self.__current_path, name)):
            return {"message": "Its a folder"}
        if os.path.exists(os.path.join(self.__current_path, name)):
            return FileResponse(path=os.path.join(self.__current_path, name),
                                media_type="application/octet-stream",
                                filename=name)
        else:
            return {"message": f"Error uploading file to {os.path.join(self.__current_path, name)}"}

    def SendFolder(self, name):
        zip_bytes_io = io.BytesIO()
        with zipfile.ZipFile(zip_bytes_io, 'w', zipfile.ZIP_DEFLATED) as zipped:
            for root, dirs, files in os.walk(os.path.join(self.__current_path, name)):
                zipped.write(root)
                for filename in files:
                    zipped.write(os.path.join(root, filename))

        response = StreamingResponse(
            iter([zip_bytes_io.getvalue()]),
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": f"attachment;filename={name}.zip",
                     "Content-Length": str(zip_bytes_io.getbuffer().nbytes)}
        )
        zip_bytes_io.close()
        return response

    def __ListFiller(self, file_list):
        ret = []
        for i in file_list:
            ret.append({"name": i[0], "is_dir": i[1], "metadata": self.__db_handler.GetDetails(
                os.path.join(self.__current_path, i[0]))["_source"]})
        return {"list": ret, "dir": os.path.sep.join(self.__current_path.split(os.path.sep)[2:]),
                "dir_list": self.__current_path.split(os.path.sep)[2:]}

    def List(self, name=None):
        if name is None:
            dir_list = []
            for i in os.listdir(self.__current_path):
                dir_list.append((i, os.path.isdir(os.path.join(self.__current_path, i))))
            return self.__ListFiller(dir_list)
        else:
            dir_list = []
            for i in os.listdir(os.path.join(self.__current_path, name)):
                dir_list.append(
                    (i, os.path.isdir(os.path.join(os.path.join(self.__current_path, name), i))))
            return self.__ListFiller(dir_list)

    def SetCurrentDirectory(self, path):
        if len(path) == 0:
            path = ['.', self.__username]
        else:
            path = path.split(os.path.sep)
            path = ['.', self.__username] + path
        path = os.path.sep.join(path)
        self.__current_path = path

    def ChangeDirectory(self, name):
        self.__current_path = os.path.join(self.__current_path, name)
        return self.List()

    def DeleteFile(self, name):
        os.remove(os.path.join(self.__current_path, name))
        self.__db_handler.DeleteEntry(os.path.join(self.__current_path, name))

    def DeleteFolder(self, name):
        for root, dirs, files in os.walk(os.path.join(self.__current_path, name)):
            for file in files:
                self.__db_handler.DeleteEntry(os.path.join(root, file))
        self.__db_handler.DeleteEntry(os.path.join(self.__current_path, name))
        shutil.rmtree(os.path.join(self.__current_path, name))

    def RenameFile(self, prev_name, name):
        details = self.__db_handler.GetDetails(os.path.join(self.__current_path,
                                                            prev_name))["_source"]
        current_time = time.time()
        details["modified"] = current_time
        details["Path"] = os.path.join(self.__current_path, name)
        details["File"] = name

        self.__db_handler.AddEntry(details)
        self.__db_handler.DeleteEntry(os.path.join(self.__current_path, prev_name))
        os.rename(os.path.join(self.__current_path, prev_name),
                  os.path.join(self.__current_path, name))

    def RenameFolder(self, prev_name, name):
        loc = len(self.__current_path.split(os.path.sep))
        for root, dirs, files in os.walk(os.path.join(self.__current_path, prev_name)):
            for file in files:
                lis = root.split(os.path.sep)
                lis[loc] = name
                details = self.__db_handler.GetDetails(os.path.join(root, file))["_source"]
                current_time = time.time()
                details["modified"] = current_time
                details["Path"] = os.path.join(os.path.sep.join(lis), file)
                self.__db_handler.AddEntry(details)
                self.__db_handler.DeleteEntry(os.path.join(root, file))

            for i_dir in dirs:
                lis = root.split(os.path.sep)
                lis[loc] = name
                details = self.__db_handler.GetDetails(os.path.join(root, i_dir))["_source"]
                current_time = time.time()
                details["modified"] = current_time
                details["Path"] = os.path.join(os.path.sep.join(lis), i_dir)
                self.__db_handler.AddEntry(details)
                self.__db_handler.DeleteEntry(os.path.join(root, i_dir))
        details = self.__db_handler.GetDetails(os.path.join(self.__current_path,
                                                            prev_name))["_source"]
        current_time = time.time()
        details["modified"] = current_time
        details["Path"] = os.path.join(self.__current_path, name)
        details["File"] = name
        self.__db_handler.AddEntry(details)
        os.rename(os.path.join(self.__current_path, prev_name),
                  os.path.join(self.__current_path, name))


class DBHandle:
    def __init__(self, username, es_username, es_password):
        self.__Index = "Files"
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

    def AddEntry(self, data):
        try:
            if not self.__ES.exists(id=data["Path"], index=self._GetIndex()):
                self.__ES.create(index=self._GetIndex(), id=data["Path"],
                                 document=data)
            else:
                self.__ES.update(index=self._GetIndex(), id=data["Path"],
                                 body={'doc': data})
            return {"status": True}
        except ConflictError:
            return {"status": False}

    def DeleteEntry(self, path):
        self.__ES.delete(id=path, index=self._GetIndex())

    def GetDetails(self, path):
        return self.__ES.get(id=path, index=self._GetIndex())


class ShareHandle:
    def __init__(self, es_username, es_password):
        self.__Index = "Files"
        self.__es_username = es_username
        self.__es_password = es_password
        self.__ES = Elasticsearch(http_auth=(self.__es_username, self.__es_password))
        self._CreateIndex()

    def _CreateIndex(self):
        if not self.__ES.indices.exists(index=Indexes[self.__Index]):
            self.__ES.indices.create(index=Indexes[self.__Index], mappings=Mapping[self.__Index])
