from fastapi import FastAPI, UploadFile, File
from starlette.requests import Request

from auth.handler import ElasticLoginHandler
from auth.model import AccountLogin
from config import Elastic_Username, Elastic_Password

app = FastAPI()

LoginHandle = ElasticLoginHandler(Elastic_Username, Elastic_Password)


@app.post("/create_user")
async def CreateUser(body: AccountLogin):
    return LoginHandle.CreateUser(body)


@app.get("/users")
async def FetchUsers(request: Request):
    return LoginHandle.FetchUsers(request.query_params.get("start", 0))


@app.post("/login_user")
async def LoginUser(body: AccountLogin):
    return LoginHandle.LoginUser(body)


@app.post("/update_password")
async def UpdatePassword(body: AccountLogin):
    return LoginHandle.UpdatePassword(body)


@app.post("/is_user")
async def UpdatePassword(body: AccountLogin):
    return LoginHandle.IsUser(body.username)


