from flask import request

from core.api import BaseAPI, AllAPI, DeleteByAPI, PaginationAPI, UpdateByAPI
from core.filter.owner import OwnerFilter
from core.permission.owner import OwnerPermission
from middleware.auth_middleware import AuthMiddleware

from model import Transaction, Item, TransactionItem


def order():
    data = request.json
    user = BaseAPI.get_session().user
    trx = Transaction(
        user=user,
        buyer_name=data["name"],
        address=data["address"],
        total_price=data["price"],
        status="Paid",
    )
    trx.save()
    item = Item.get(Item.sku == data["sku"])
    item.stock -= 1
    item.save()
    trx_item = TransactionItem(item=item, transaction=trx, qty=1)
    trx_item.save()
    return BaseAPI(None).respond(trx.to_dict())


fields = ["address", "buyer_name", "status", "total_price", "tracking"]


endpoints = {
    "": ("GET", AuthMiddleware(AllAPI(Transaction).with_filter(OwnerFilter))),
    "/delete/<id>": (
        "POST",
        AuthMiddleware(DeleteByAPI(Transaction).with_permission(OwnerPermission)),
    ),
    "/page/<page>/<limit>": (
        "GET",
        AuthMiddleware(PaginationAPI(Transaction).with_filter(OwnerFilter)),
    ),
    "/order": ("POST", AuthMiddleware(order)),
    "/update/<id>": (
        "POST",
        AuthMiddleware(
            UpdateByAPI(Transaction)
            .with_permission(OwnerPermission)
            .with_fields(fields)
        ),
    ),
}
