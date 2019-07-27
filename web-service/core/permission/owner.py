from core.permission.base import BasePermission


class OwnerPermission(BasePermission):
    def __call__(self, *args, **kwargs):
        instance = self.api.model.get_or_none(
            getattr(self.api.model, self.api.by) == self.api.by_value
        )
        if not instance:
            return True

        session = self.api.get_session()

        if instance:
            return instance.user == session.user
