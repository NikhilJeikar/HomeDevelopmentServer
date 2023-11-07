from fastapi import UploadFile, File
from starlette.responses import FileResponse

import os

FTP_BASE_PATH = "."


class FileHandle:
    def __init__(self):
        self.__base_path = FTP_BASE_PATH
        self.__crnt_path = self.__base_path

    def CreateFile(self, name):
        file = open(os.path.join(self.__crnt_path, name), 'w')
        file.close()

    def CreateFolder(self, name):
        try:
            os.mkdir(os.path.join(self.__crnt_path, name))
        except FileExistsError:
            return {"message": "Folder already exist"}

    def WriteFile(self, file: UploadFile = File(...)):
        try:
            filename = os.path.join(self.__crnt_path, file.filename)
            with open(filename, 'wb') as f:
                while contents := file.file.read(1024 * 1024):
                    f.write(contents)
        except Exception as e:
            print(e)
            return {"message": "Error uploading the file"}
        finally:
            file.file.close()

    def SendFile(self, name):
        if os.path.isdir(os.path.join(self.__crnt_path, name)):
            return {"message": "Its a folder"}
        if os.path.exists(os.path.join(self.__crnt_path, name)):
            return FileResponse(path=os.path.join(self.__crnt_path, name),
                                media_type="application/octet-stream",
                                filename=name)
        else:
            return {"message": f"Error uploading file to {os.path.join(self.__crnt_path, name)}"}

    def List(self, name=None):
        if name is None:
            dir_list = []
            for i in os.listdir(self.__crnt_path):
                dir_list.append((i, os.path.isdir(os.path.join(self.__crnt_path, i))))
            return dir_list
        else:
            dir_list = []
            for i in os.listdir(os.path.join(self.__crnt_path, name)):
                dir_list.append(
                    (i, os.path.isdir(os.path.join(os.path.join(self.__crnt_path, name), i))))
            return dir_list

    def ChangeDirectory(self, name):
        if name == "..":
            tmp_list = self.__crnt_path.split()
            tmp_list.pop(-1)
            self.__crnt_path = "/".join(tmp_list)
        else:
            self.__crnt_path = os.path.join(self.__crnt_path, name)
