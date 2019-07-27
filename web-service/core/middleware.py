from typing import Callable


class MiddleWare:
    def __init__(self, next: Callable):
        self.next = next

    def pre_check(self, *args, **kwargs) -> bool:
        return False

    def default(self):
        pass

    def __call__(self, *args, **kwargs):
        if self.pre_check(*args, **kwargs):
            return self.next(*args, **kwargs)
        else:
            return self.default(*args, **kwargs)
