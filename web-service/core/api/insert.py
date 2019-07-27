from peewee import Model
from flask import request
from core.api import BaseAPI


class InsertAPI(BaseAPI):
    def __init__(self, model: Model):
        super().__init__(model)
        self.fields = []

    def commit(self, *args, **kwargs):
        data = request.json
        instance = self.model(**self.__filter_data(data))

        if self.user:
            instance.user = self.get_session().user

        try:
            instance.save()
            return self.respond(instance.to_dict())
        except Exception as e:
            return self.respond({}, str(e), 500)

    def __filter_data(self, data):
        filtered_data = {}
        for key in self.fields:
            filtered_data[key] = data[key]

        return filtered_data

    def with_fields(self, fields):
        self.fields = fields
        return self

    def with_user(self):
        self.user = True
        return self
