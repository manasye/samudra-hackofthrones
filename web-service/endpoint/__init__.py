from endpoint.user import endpoints as user_endpoints
from endpoint.session import endpoints as session_endpoints
from endpoint.item import endpoints as item_endpoints
from endpoint.transaction import endpoints as transaction_endpoints

endpoints = {
    "/user": user_endpoints,
    "": session_endpoints,
    "/item": item_endpoints,
    "/transaction": transaction_endpoints,
}
