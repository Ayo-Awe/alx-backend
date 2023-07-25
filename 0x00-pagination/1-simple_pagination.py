#!/usr/bin/env python3

"""This module contains code for alx backend
pagination tasks
"""

import csv
from typing import List
import math


def index_range(page: int, page_size: int) -> "tuple[int, int]":
    """ return a tuple of size two containing a start index
    and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters.
    """
    start_index = (page-1) * page_size
    end_index = page * page_size

    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """akes two integer arguments page with default value 1
        and page_size with default value 10.
        """
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0

        dataset = self.dataset()

        start, end = index_range(page, page_size)
        result = []

        for i in range(start, end):
            try:
                result.append(dataset[i])
            except IndexError:
                break

        return result
