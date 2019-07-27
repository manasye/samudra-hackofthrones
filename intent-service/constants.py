STATE = {
    "default": check_stock(),
    "order": lambda: "Bisa gan, mau dikirim ke mana?",
    "address": send_bill(),
    "payment": process(),
}
