#!/usr/bin/env python3

"""This module contains code for lfu cache
"""

from base_caching import BaseCaching
from typing import Dict, Tuple


class LFUCache(BaseCaching):
    """LFU cache class
    """

    def __init__(self):
        super().__init__()
        self.__ranked_keys: Dict[any, Tuple[int, int]] = {}
        self.__next_rank = 0

    def put(self, key, item):
        """Assigns to the dictionary self.cache_data
        the item value for the key.
        """
        if key is None or item is None:
            return

        if len(self.cache_data) == self \
                .MAX_ITEMS and key not in self.cache_data:
            discard_key = lowest_key_by_frequency_and_rank(self.__ranked_keys)
            del self.cache_data[discard_key]
            del self.__ranked_keys[discard_key]
            print("DISCARD: {}".format(discard_key))

        freq_rank = self.__ranked_keys.get(key)

        if freq_rank is None:
            self.__ranked_keys[key] = (0, self.__next_rank)
        else:
            frequency, _ = freq_rank
            self.__ranked_keys[key] = (frequency+1, self.__next_rank)

        self.cache_data[key] = item
        self.__next_rank += 1

    def get(self, key):
        """returns the value in self.cache_data
        linked to key
        """

        if key is None:
            return None

        freq_rank = self.__ranked_keys.get(key)

        if freq_rank is not None:
            frequency, _ = freq_rank
            self.__ranked_keys[key] = (frequency+1, self.__next_rank)

        self.__next_rank += 1

        return self.cache_data.get(key)


def lowest_key_by_frequency_and_rank(dic: Dict[any, Tuple[int, int]]):
    """
    retrieves the key from a dictionary of
    tuples (frequency, rank) with the lowest frequency
    and rank
    """

    if dic is None or len(dic) == 0:
        return None

    new_tup = [(key, data[0], data[1]) for key, data in dic.items()]

    sorted_data = sorted(new_tup, key=lambda x: x[1])
    lowest_frequency = sorted_data[0][1]
    keys_with_lowest_frequency = filter(
        lambda x: x[1] == lowest_frequency, sorted_data)
    sorted_data = sorted(keys_with_lowest_frequency, key=lambda x: x[2])

    return sorted_data[0][0]
