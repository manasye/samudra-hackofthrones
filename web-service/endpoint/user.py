from core.api import AllAPI, GetByAPI, InsertAPI, DeleteByAPI, UpdateByAPI
from model import User


endpoints = {
    "/all": ("GET", AllAPI(User)),
    "/username/<username>": ("GET", GetByAPI(User, by="username")),
    "/id/<id>": ("GET", GetByAPI(User, by="id")),
    "": (
        "POST",
        InsertAPI(User).with_fields(["username", "password", "shop", "email"]),
    ),
    "/delete/<id>": ("POST", DeleteByAPI(User, "id")),
    "/update/<id>": (
        "POST",
        UpdateByAPI(User, "id").with_fields(["username", "password", "email", "shop"]),
    ),
}
