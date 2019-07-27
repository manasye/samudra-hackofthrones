from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room

from model import Session, User

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)


unread_messages = {}


@socketio.on("join")
def room_join(data):
    join_room(data["room"])
    emit("web-recv", {"message": "ok", "from_user": "server"}, room=data["room"])


@socketio.on("line-send")
def handle_line(message):
    user = User.get_or_none(User.username == message["to_user"])
    session = user.session[0].key
    if not unread_messages.get(session, None):
        unread_messages[session] = [message]
    else:
        unread_messages[session].append(message)
    del message["to_user"]
    emit("web-recv", message, room=session)


@socketio.on("web-send")
def handle_web(message):
    session = Session.get_or_none(key=message["from_user"])
    if not unread_messages.get(session.key, None):
        unread_messages[session.key] = [message]
    else:
        unread_messages[session.key].append(message)
    dupe_message = message.copy()
    dupe_message["from_user"] = session.user.username
    emit("line-recv", dupe_message, broadcast=True)


@socketio.on("web-sync")
def web_sync(token):
    emit("web-messages", unread_messages.get(token, []))


def chat_server_start():
    socketio.run(app, host="0.0.0.0", port=5001)
