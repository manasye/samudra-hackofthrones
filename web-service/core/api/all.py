from peewee import Model
from core.api import BaseAPI


class AllAPI(BaseAPI):
    def __init__(self, model: Model):
        super().__init__(model)

    def commit(self, *args, **kwargs):
        if not self.injected:
            results = self.model.select()
        else:
            results = self.model.select().where(
                getattr(self.model, self.by) == self.by_value
            )
        results = [r.to_dict() for r in results]

        return self.respond(results)
