import argparse
import requests

parser = argparse.ArgumentParser()

parser.add_argument("-u", "--user", help="Username")
parser.add_argument("-p", "--password", help="Password")

args = parser.parse_args()


resp = requests.post("http://127.0.0.1:8000/api/user/create_user", json={
    "username": args.user,
    "password": args.password
})
print(resp.json())
