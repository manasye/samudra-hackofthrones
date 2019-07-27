from threading import Thread
from client.instagram.client import InstagramClient


class ItemObserver:
    instance = None

    def __init__(self):
        self.threads = []

    @classmethod
    def load(cls):
        if cls.instance:
            return cls.instance

        instance = cls()
        cls.instance = instance

        return instance

    def notify(self, item):
        thread = Thread(target=InstagramClient.upload, args=[item])
        thread.start()
        self.threads.append(thread)
