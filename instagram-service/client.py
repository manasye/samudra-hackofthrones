import os
import json
import requests
from random import randint


class InstagramClient:
    def __init__(self):
        self.client = requests.session()
        self.headers = {}
        self.headers[
            "User-Agent"
        ] = "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
        self.headers["x-csrftoken"] = "bnP6gmUR4bVTXrf6XJGXrCHdzSWcnAh8"
        self.headers["x-instagram-ajax"] = "6f0940784b41"
        self.headers["x-requested-with"] = "XMLHttpRequest"
        self.headers[
            "Cookie"
        ] = 'mid=W9mI2AAEAAGgOWsNaRPAIGOK18ik; mcd=3; csrftoken=bnP6gmUR4bVTXrf6XJGXrCHdzSWcnAh8; ds_user_id=10879487349; sessionid=10879487349%3AmuDRCsMOxvDACq%3A2; rur=FRC; urlgen="{"117.54.140.18": 9340}:1gsX3k:pvWrkFs0k0JBYBPQb4KnHSTqqyc"'

    def upload(self, img_url, caption):
        r = requests.get(img_url)

        data = {
            "upload_id": (None, str(randint(1559845774232, 1559855774232))),
            "photo": ("photo.jpg", r.content),
            "media-type": (None, "1"),
        }

        r = self.client.post(
            "https://www.instagram.com/create/upload/photo/",
            files=data,
            headers=self.headers,
        )
        upload_id = json.loads(r.text)["upload_id"]
        print(upload_id)
        data = {
            "upload_id": upload_id,
            "caption": caption,
            "usertags": "",
            "custom_accessibility_caption": "",
            "retry_timeout": "",
        }
        r = self.client.post(
            "https://www.instagram.com/create/configure/",
            data=data,
            headers=self.headers,
        )
        return "media" in json.loads(r.text)
