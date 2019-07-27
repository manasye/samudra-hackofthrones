from peewee import Model
from flask import request
from core.api import BaseAPI


class UpdateByAPI(BaseAPI):
    def __init__(self, model: Model, by="id"):
        super().__init__(model)
        self.by = by
        self.fields = []

    def commit(self, *args, **kwargs):
        data = request.json
        if not self.injected:
            self.by_value = kwargs[self.by]

        instance = self.model.get_or_none(getattr(self.model, self.by) == self.by_value)

        if not instance:
            return self.respond404(f"{self.model.__name__} not found")

        for field in self.fields:
            setattr(instance, field, data[field])

        try:
            instance.save()
            return self.respond(instance.to_dict())
        except Exception as e:
            return self.respond({}, str(e), 500)

    def with_fields(self, fields):
        self.fields = fields
        return self
