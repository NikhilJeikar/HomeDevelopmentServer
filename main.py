import uvicorn
from fastapi import FastAPI, UploadFile, File, Depends, Header, HTTPException
from starlette.requests import Request

from auth.handler import ElasticLoginHandler
from auth.model import AccountLogin
from config import Elastic_Username, Elastic_Password

from ftp.handler import FileHandle
from ftp.model import FileList, Create
import os

app = FastAPI()

LoginHandle = ElasticLoginHandler(Elastic_Username, Elastic_Password)


async def Authorize(user: str = Header(), session: str = Header()):
    if not LoginHandle.ValidateUser(user, session)["status"]:
        raise HTTPException(401)


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


@app.post("/user/authorize", dependencies=[Depends(Authorize)])
async def Authorized():
    return {"status": True}


@app.post("/user/logout", dependencies=[Depends(Authorize)])
async def Logout(session: str = Header()):
    return LoginHandle.LogoutUser(session)


@app.post("/home/file-list", dependencies=[Depends(Authorize)])
async def FileList(body: FileList, user: str = Header()):
    body.username = user
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    if type(body.current_path) == str:
        if len(body.current_path) != 0:
            FileHandler.SetCurrentDirectory(body.current_path)
    elif type(body.current_path) == list:
        if len(body.current_path) != 0:
            FileHandler.ChangeDirectory(os.path.sep.join(body.current_path))
    return FileHandler.List()


@app.post("/home/create-file", dependencies=[Depends(Authorize)])
async def CreateFile(body: Create, user: str = Header()):
    body.username = user
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.CreateFile(body.name)


@app.post("/home/create-folder", dependencies=[Depends(Authorize)])
async def CreateFolder(body: Create, user: str = Header()):
    body.username = user
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.CreateFolder(body.name)


@app.post("/home/change-folder", dependencies=[Depends(Authorize)])
async def ChangeDirectory(body: Create, user: str = Header()):
    body.username = user
    FileHandler = FileHandle(body.username, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(body.current_path)
    return FileHandler.ChangeDirectory(body.name)


@app.post("/home/upload-file", dependencies=[Depends(Authorize)])
async def UploadFiles(path: str, files: UploadFile = File(...), user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(path)
    FileHandler.WriteFile(files)
    return {"name": files.filename}


@app.get("/home/download-file", dependencies=[Depends(Authorize)])
async def DownloadFile(current_path, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.SendFile(name)


@app.get("/home/download-folder", dependencies=[Depends(Authorize)])
async def DownloadFolder(current_path, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.SendFolder(name)


@app.get("/home/delete-file", dependencies=[Depends(Authorize)])
async def DeleteFile(current_path, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.DeleteFile(name)


@app.get("/home/delete-folder", dependencies=[Depends(Authorize)])
async def DeleteFolder(current_path, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.DeleteFolder(name)


@app.get("/home/rename-file", dependencies=[Depends(Authorize)])
async def RenameFile(current_path, prev_name, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.RenameFile(prev_name, name)


@app.get("/home/rename-folder", dependencies=[Depends(Authorize)])
async def RenameFolder(current_path, prev_name, name, user: str = Header()):
    FileHandler = FileHandle(user, Elastic_Username, Elastic_Password)
    FileHandler.SetCurrentDirectory(current_path)
    return FileHandler.RenameFolder(prev_name, name)


if __name__ == '__main__':
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True, workers=16)
