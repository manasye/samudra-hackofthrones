from core.api import BaseAPI

from peewee import Model


class PaginationAPI(BaseAPI):
    def __init__(self, model: Model):
        super().__init__(model)

    def commit(self, *args, **kwargs):
        page = int(kwargs.get("page", 1))
        limit = int(kwargs.get("limit", 10))

        obj_count = self.model.select().count()
        result = self.model.select().paginate(page, limit + 1)
        result = [r.to_dict() for r in result]

        return self.respond(result, addition={"page": page, "count": obj_count})
