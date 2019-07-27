from core.api import BaseAPI


class BaseFilter:
    def __init__(self, api: BaseAPI):
        self.api = api

    def __call__(self, *args, **kwargs):
        pass
