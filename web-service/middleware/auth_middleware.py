from flask import request

from core.middleware import MiddleWare
from model import Session


class AuthMiddleware(MiddleWare):
    def pre_check(self, *args, **kwargs):
        key = request.headers.get("Authorization", None)
        if not key:
            return False

        session = Session.get_or_none(key=key.split()[1])
        return session

    def default(self, *args, **kwargs):
        return "You are not in session"
