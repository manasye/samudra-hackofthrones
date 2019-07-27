from flask import jsonify, request
from peewee import Model
from typing import Iterable, AnyStr, Callable

from model import Session


class BaseAPI:
    def __init__(self, model: Model):
        self.model: Model = model
        self.by: AnyStr = ""
        self.by_value = None
        self.injected = False
        self.check_func = lambda *args, **kwargs: True
        self.filter_func = lambda result: result

    def respond(self, data: Iterable, message="", status=200, addition={}):
        addition["result"] = self.filter(data)
        addition["status"] = status
        addition["message"] = message
        return jsonify(addition), status

    def respond404(self, message: AnyStr):
        return self.respond({}, message, status=404)

    def respond403(self):
        return self.respond({}, "Not Authorized", 403)

    @staticmethod
    def get_session():
        session_key = request.headers.get("Authorization", None)
        if not session_key:
            return

        session_key = session_key.split()[1]
        session = Session.get_or_none(Session.key == session_key)

        return session

    def inject_user(self):
        session = self.get_session()
        if not session:
            return

        self.by = "user"
        self.by_value = session.user
        self.injected = True

    def __call__(self, *args, **kwargs):
        if self.check(*args, **kwargs):
            return self.commit(*args, **kwargs)
        else:
            return self.respond403()

    def filter(self, result):
        return self.filter_func(result)

    def check(self, *args, **kwargs):
        return self.check_func(*args, **kwargs)

    def with_permission(self, checker):
        self.check_func = checker(self)
        return self

    def with_filter(self, filter):
        self.filter_func = filter(self)
        return self

    def commit(self, *args, **kwargs):
        return self.respond({}, message="commit not overrode", status=500)
