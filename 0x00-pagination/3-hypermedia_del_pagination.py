#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """takes two integer arguments: index with a None default value
        and page_size with default value of 10.
        """
        assert index >= 0 and index < len(self.dataset())
        dataset = self.indexed_dataset()

        data = []

        keys = list(filter(lambda x: x >= index, list(dataset.keys())))
        keys.sort()

        target_keys = keys[:page_size+1]

        for key in target_keys[:page_size]:
            data.append(dataset[key])

        return {
            "index": index,
            "data": data,
            "next_index": None if len(target_keys) <
            page_size+1 else target_keys[-1],
            "page_size": len(data)
        }
