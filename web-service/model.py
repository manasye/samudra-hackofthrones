from datetime import datetime
import peewee as pw

from playhouse.shortcuts import model_to_dict
from util import generate_random_str
from observer.item_observer import ItemObserver


db = pw.SqliteDatabase("data.db")


class BaseModel(pw.Model):
    created_at = pw.DateTimeField(default=datetime.now)
    updated_at = pw.DateTimeField(default=datetime.now)

    def save(self, force_insert=False, only=None):
        self.updated_at = datetime.now()
        super().save(force_insert, only)

    def to_dict(self):
        return model_to_dict(self, exclude=[BaseModel.created_at, BaseModel.updated_at])

    class Meta:
        database = db


class User(BaseModel):
    username = pw.CharField(unique=True)
    email = pw.CharField(unique=True)
    password = pw.CharField()
    shop = pw.CharField(unique=True)

    def to_dict(self):
        return model_to_dict(
            self,
            backrefs=True,
            exclude=[User.password, User.created_at, User.updated_at],
        )


class Session(BaseModel):
    user = pw.ForeignKeyField(User, backref="session")
    key = pw.CharField(default=generate_random_str)

    def to_dict(self):
        return model_to_dict(self, backrefs=True)


class Item(BaseModel):
    user = pw.ForeignKeyField(User, backref="items")
    sku = pw.CharField(unique=True)
    name = pw.CharField()
    image_url = pw.CharField()
    description = pw.TextField()
    stock = pw.IntegerField()
    price = pw.FloatField()

    def save(self, force_insert=False, only=None):
        self.updated_at = datetime.now()
        super().save(force_insert, only)
        ItemObserver.load().notify(self)


class Transaction(BaseModel):
    user = pw.ForeignKeyField(User, backref="transactions")
    buyer_name = pw.CharField()
    address = pw.CharField()
    total_price = pw.FloatField()
    status = pw.CharField()
    tracking = pw.CharField(null=True)

    def delete_instance(self, recursive=False, delete_nullable=False):
        for x in self.items:
            x.delete_instance()

        super().delete_instance(recursive, delete_nullable)

    def to_dict(self):
        return model_to_dict(self, backrefs=True, manytomany=True)


class TransactionItem(BaseModel):
    item = pw.ForeignKeyField(Item, backref="transactions")
    transaction = pw.ForeignKeyField(Transaction, backref="items")
    qty = pw.IntegerField()
