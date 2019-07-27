from core.filter.base import BaseFilter


class OwnerFilter(BaseFilter):
    def __call__(self, result):
        filtered = []
        user = self.api.get_session().user
        if type(result) == list:
            for r in result:
                if r["user"]["id"] != user.id:
                    continue
                del r["user"]
                filtered.append(r)

            return filtered
        else:
            if result["user"]["id"] != user.id:
                return result
            else:
                return {}
