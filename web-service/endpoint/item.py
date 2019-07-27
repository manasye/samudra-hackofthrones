from core.api import AllAPI, DeleteByAPI, UpdateByAPI, PaginationAPI, InsertAPI
from core.filter.owner import OwnerFilter
from core.permission.owner import OwnerPermission
from middleware.auth_middleware import AuthMiddleware

from model import Item


fields = ["sku", "name", "image_url", "stock", "price", "description"]

endpoints = {
    "": ("GET", AuthMiddleware(AllAPI(Item).with_filter(OwnerFilter))),
    "/update/<sku>": (
        "POST",
        AuthMiddleware(
            UpdateByAPI(Item, by="sku")
            .with_permission(OwnerPermission)
            .with_fields(fields)
        ),
    ),
    "/new": ("POST", AuthMiddleware(InsertAPI(Item).with_user().with_fields(fields))),
    "/delete/<sku>": (
        "POST",
        AuthMiddleware(DeleteByAPI(Item, by="sku").with_permission(OwnerPermission)),
    ),
    "/page/<page>/<limit>": (
        "GET",
        AuthMiddleware(PaginationAPI(Item).with_filter(OwnerFilter)),
    ),
}
