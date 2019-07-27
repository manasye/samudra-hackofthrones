from model import *


db.connect()
db.create_tables([User, Session, Item, Transaction, TransactionItem])
db.close()
