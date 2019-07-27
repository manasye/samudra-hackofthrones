from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
from threading import Thread

from core.router import Router
from model import db
from endpoint import endpoints
from chat_socket.chat import chat_server_start


app = Flask(__name__)
CORS(app)
router = Router(app)
load_dotenv()


@app.before_request
def before():
    if db.is_closed():
        db.connect()


@app.after_request
def after(req):
    if not db.is_closed():
        db.close()

    return req


for group_name, group_endpoints in endpoints.items():
    router.group(group_name, group_endpoints)


if __name__ == "__main__":
    thread = Thread(target=chat_server_start)
    thread.start()
    router.start()
