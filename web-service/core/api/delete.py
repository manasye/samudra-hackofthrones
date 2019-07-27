from peewee import Model

from core.api import BaseAPI


class DeleteByAPI(BaseAPI):
    def __init__(self, model: Model, by="id"):
        super().__init__(model)
        self.by = by

    def commit(self, *args, **kwargs):
        if not kwargs.get(self.by, None):
            return self.respond({}, "No key parameter passed", 400)

        if not self.injected:
            self.by_value = kwargs[self.by]

        result = self.model.get_or_none(getattr(self.model, self.by) == self.by_value)

        if result:
            result.delete_instance(delete_nullable=True)
            return self.respond(result.to_dict(), "Deleted Successfully")
        else:
            return self.respond404(f"{self.model.__name__} not found")
