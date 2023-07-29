#!/usr/bin/env python3

"""This module contains code for basic cache
"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Basic cache class
    """

    def put(self, key, item):
        """Assigns to the dictionary self.cache_data
        the item value for the key key.
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

    def get(self, key):
        """returns the value in self.cache_data
        linked to key
        """

        if key is None:
            return None

        return self.cache_data.get(key)
