from flask import Flask, request, abort
from dotenv import load_dotenv
import requests
import os

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage

from socket_client import ChatListener

app = Flask(__name__)
load_dotenv()

line_bot_api = LineBotApi(os.getenv("ACCESS_TOKEN"))
handler = WebhookHandler(os.getenv("SECRET"))
chat_listener = ChatListener(line_bot_api)


@app.route("/callback", methods=["POST"])
def callback():
    signature = request.headers["X-Line-Signature"]
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return "OK"


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    try:
        profile = line_bot_api.get_profile(user_id=event.source.user_id)
        r = requests.post(
            os.getenv("INTENT_ENDPOINT"),
            json={
                "name": profile.display_name,
                "message": event.message.text,
                "user_id": event.source.user_id,
            },
        )

        print(r.text)

        if r.text.find("diff_intent") != -1:
            text = {
                "from_user": {
                    "id": event.source.user_id,
                    "name": profile.display_name,
                    "image": profile.picture_url,
                },
                "message": event.message.text,
                "to_user": "tester",
            }
            chat_listener.send_to_web(text)
            print(text)
        else:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text=r.text))
    except Exception as e:
        print(e)


if __name__ == "__main__":
    chat_listener.start()
    app.run(port=443, host="0.0.0.0")
