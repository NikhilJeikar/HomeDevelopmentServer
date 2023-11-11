import uvicorn
from fastapi import FastAPI, UploadFile, File
from starlette.requests import Request

from auth.handler import ElasticLoginHandler
from auth.model import AccountLogin
from config import Elastic_Username, Elastic_Password

from ftp.handler import FileHandle
from ftp.model import FileList, Create
import os

app = FastAPI()

LoginHandle = ElasticLoginHandler(Elastic_Username, Elastic_Password)


@app.post("/user/create_user")
async def CreateUser(body: AccountLogin):
    return LoginHandle.CreateUser(body)


@app.get("/user/users")
async def FetchUsers(request: Request):
    return LoginHandle.FetchUsers(request.query_params.get("start", 0))


@app.post("/user/login_user")
async def LoginUser(body: AccountLogin):
    return LoginHandle.LoginUser(body)


@app.post("/user/update_password")
async def UpdatePassword(body: AccountLogin):
    return LoginHandle.UpdatePassword(body)


@app.post("/user/is_user")
async def UpdatePassword(body: AccountLogin):
    return LoginHandle.IsUser(body.username)


@app.post("/home/file-list")
async def FileList(body: FileList):
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    if type(body.current_path) == str:
        if len(body.current_path) != 0:
            FileHandler.SetCurrentDirectory(body.current_path)
    elif type(body.current_path) == list:
        if len(body.current_path) != 0:
            FileHandler.ChangeDirectory(os.path.sep.join(body.current_path))
    return FileHandler.List()


@app.post("/home/create-file")
async def CreateFile(body: Create):
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.CreateFile(body.name)


@app.post("/home/create-folder")
async def CreateFolder(body: Create):
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.CreateFolder(body.name)


@app.post("/home/change-folder")
async def ChangeDirectory(body: Create):
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.ChangeDirectory(body.name)


@app.post("/home/upload-file")
async def UploadFiles(username: str, path: str, files: UploadFile = File(...)):
    FileHandler = FileHandle(username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(path)
    FileHandler.WriteFile(files)
    return {"name": files.filename}


@app.get("/home/download-file")
async def DownloadFile(username, current_path, name):
    FileHandler = FileHandle(username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.SendFile(name)


@app.get("/home/download-folder")
async def DownloadFolder(username, current_path, name):
    FileHandler = FileHandle(username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.SendFolder(name)


if __name__ == '__main__':
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)
