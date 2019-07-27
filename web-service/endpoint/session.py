from flask import request
from model import User, Session
from core.api import BaseAPI


def login():
    data = request.json
    user = User.get_or_none(
        User.email == data["email"], User.password == data["password"]
    )
    if not user:
        return BaseAPI(None).respond404("User not found")

    session = Session.get_or_none(Session.user == user)
    if session:
        return BaseAPI(None).respond(session.to_dict())

    session = Session(user=user)
    session.save()

    return BaseAPI(None).respond(session.to_dict())


def register():
    data = request.json
    user = User(
        email=data["email"],
        username=data["username"],
        password=data["password"],
        shop=data["shop"],
    )
    user.save()
    session = Session(user=user)
    session.save()

    return BaseAPI(None).respond(session.to_dict())


endpoints = {"/login": ("POST", login), "/register": ("POST", register)}
