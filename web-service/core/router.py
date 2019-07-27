from flask import Flask
from typing import Callable, Dict, AnyStr


class Router:
    def __init__(self, app: Flask):
        self.app = app

    def get(self, endpoint_name: AnyStr, handler: Callable):
        self.app.add_url_rule(
            endpoint_name, endpoint=endpoint_name, view_func=handler, methods=["GET"]
        )

    def post(self, endpoint_name: AnyStr, handler: Callable):
        self.app.add_url_rule(
            endpoint_name, endpoint=endpoint_name, view_func=handler, methods=["POST"]
        )

    def group(self, group_name, endpoints: Dict):
        for endpoint_name, setting in endpoints.items():
            method, handler = setting
            if method == "GET":
                self.get(group_name + endpoint_name, handler)
            elif method == "POST":
                self.post(group_name + endpoint_name, handler)

    def start(self, host="0.0.0.0", port=5000):
        self.app.run(host, port)
