from flask import Flask, request
import redis


from jnt_client import JnTClient
from web_client import WebClient


app = Flask(__name__)

r = redis.Redis(host="localhost", port=6379, db=0)
web_client = WebClient()
jnt_client = JnTClient()


def check_stock(user_id, name, msg):
    product_name = " ".join(msg.split()[:-2])
    sku, stock = web_client.get_detail(product_name)
    if stock:
        r.set(user_id, f"order|{sku}|{product_name}")
        return f"Ready gan, sisa {stock} nih"
    else:
        r.set(user_id, "default")
        return f"Wah sori gan, kosong..."


def accept_order(user_id, name, msg):
    state, sku, product_name = str(r.get(user_id))[2:-1].split("|")
    r.set(user_id, f"address|{sku}|{product_name}")
    return f"{product_name} kan? Bisa gan, mau dikirim ke mana?"


def send_bill(user_id, name, msg):
    state, sku, product_name = str(r.get(user_id))[2:-1].split("|")
    print(state, sku, product_name)
    price = web_client.get_price(product_name)
    tariff = jnt_client.check_tariff(msg)
    r.set(user_id, f"payment|{sku}|{price}|{msg}")
    result = web_client.order(sku, name, msg, price)
    result = result["result"]

    return f'Oke gan, ongkir {tariff}, harganya {price}, pembayaran lewat sini ya gan http://samudra.tech/payment/{result["id"]}'


def process(user_id, name, msg):
    state, sku, price, address = str(r.get(user_id))[2:-1].split("|")
    price = float(price)
    r.set(user_id, "")

    return f"Sip gan, udah diterima bayarannya, kami proses ya!"


handler = {
    "default": check_stock,
    "order": accept_order,
    "address": send_bill,
    "payment": process,
}


@app.route("/intent", methods=["POST"])
def handle():
    data = request.json
    user_id, name, message = data["user_id"], data["name"], data["message"]
    state = str(r.get(user_id))[2:-1]

    if state == "" or state is None or len(state) < 4:
        if message.lower().find("ready") == -1:
            return "diff_intent"

        else:
            state = "default"

    if state.find("|") != -1:
        state = state.split("|")[0]

    return handler[state](user_id, name, message)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
