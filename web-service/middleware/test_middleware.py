from core.middleware import MiddleWare


class TestMiddleware(MiddleWare):
    def pre_check(self, *args, **kwargs):
        return kwargs.get("name", None) == "gabriel"

    def default(self, *args, **kwargs):
        return "You're not gabriel!"
