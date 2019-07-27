import os
import json
import requests


class InstagramClient:
    @staticmethod
    def upload(item):
        if not item:
            return

        data = {"image": item.image_url, "caption": InstagramClient.build_caption(item)}
        success = False
        while not success:
            r = requests.post(os.getenv("INSTAGRAM_SERVICE"), json=data)
            success = json.loads(r.text)["status"] == "success"

    @staticmethod
    def build_caption(item):
        caption = f"*** {item.name} ***\n"
        caption += f"SKU: {item.sku}\n"
        caption += f"Price: Rp. {item.price}\n"
        caption += f"Description: {item.description}\n"

        return caption
