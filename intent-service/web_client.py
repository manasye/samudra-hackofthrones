import requests
import json


class WebClient:
    def __init__(self):
        self.headers = {}
        self.headers["Authorization"] = "Bearer dXIaAntIakMNhgoDCyBjPcbKwlQltU"
        self.base_link = "http://localhost:5000/"

    def get(self, route):
        r = requests.get(self.base_link + route, headers=self.headers)
        print(r.text)
        return json.loads(r.text)

    def post(self, route, data):
        r = requests.post(self.base_link + route, json=data, headers=self.headers)
        print(r.text)
        return json.loads(r.text)

    def get_detail(self, name):
        name = name.lower()
        result = self.get("item")
        items = result["result"]

        for i in items:
            if i["name"].lower().find(name) != -1:
                return i["sku"], i["stock"]

        return "", 0

    def get_price(self, name):
        name = name.lower()
        result = self.get("item")
        items = result["result"]

        for i in items:
            if i["name"].lower().find(name) != -1:
                return i["price"]

        return 0

    def order(self, sku, name, address, price):
        data = {"name": name, "address": address, "price": price, "sku": sku}
        result = self.post("transaction/order", data)
        return result
