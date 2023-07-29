#!/usr/bin/env python3

"""This module contains code for lifo cache
"""

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFO cache class
    """

    def __init__(self):
        super().__init__()
        self.__queue = []

    def put(self, key, item):
        """Assigns to the dictionary self.cache_data
        the item value for the key.
        """
        if key is None or item is None:
            return

        if len(self.__queue) == self.MAX_ITEMS and key not in self.cache_data:
            discard_key = self.__queue.pop()
            del self.cache_data[discard_key]
            print("DISCARD: {}".format(discard_key))

        if key in self.cache_data:
            key_index = self.__queue.index(key)
            del self.__queue[key_index]

        self.cache_data[key] = item
        self.__queue.append(key)

    def get(self, key):
        """returns the value in self.cache_data
        linked to key
        """

        if key is None:
            return None

        return self.cache_data.get(key)
