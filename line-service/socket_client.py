import os
from threading import Thread
from socketIO_client import SocketIO, LoggingNamespace
from linebot.models import TextSendMessage


class ChatListener(Thread):
    def __init__(self, bot):
        super(ChatListener, self).__init__()
        self.bot = bot
        self.client = SocketIO(
            os.getenv("CHAT_HOST"), os.getenv("CHAT_PORT"), LoggingNamespace
        )

    def send_to_line(self, message):
        print(message)
        self.bot.push_message(
            message["to_user"], TextSendMessage(text=message["message"])
        )

    def send_to_web(self, message):
        self.client.emit("line-send", message)

    def run(self):
        self.client.on("line-recv", self.send_to_line)
        self.client.wait()
