from bs4 import BeautifulSoup as bs
import requests
import json


class JnTClient:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
        }
        self.base_link = "http://www.jet.co.id/tariff"
        self.client = requests.session()

    def check_tariff(self, address):
        r = self.client.get(self.base_link, headers=self.headers)
        bs_ = bs(r.text, "html.parser")

        token = bs_.find("input", {"name": "_token"}).get("value")
        data = {
            "_token": token,
            "from": "KEMAYORAN, JAKARTA, DKI JAKARTA",
            "to": address.upper(),
            "weight": "1",
            "dimension[p]": "",
            "dimension[l]": "",
            "dimension[t]": "",
        }

        r = self.client.post(self.base_link, headers=self.headers, data=data)
        bs_ = bs(r.text, "html.parser")
        return bs_.find("p", {"class": "cost-amount"}).text.strip()
