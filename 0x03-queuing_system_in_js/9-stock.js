import express from "express";
import { createClient } from "redis";
import { promisify } from "util";

const app = express();
const redisClient = createClient();

const listProducts = [
  {
    itemId: 1,
    itemName: "Suitcase 250",
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: "Suitcase 450",
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: "Suitcase 650",
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: "Suitcase 1050",
    price: 550,
    initialAvailableQuantity: 5,
  },
];

function getItemById(itemId) {
  return listProducts.find((p) => p.itemId == itemId);
}

function reserveStockById(itemId, stock) {
  redisClient.set(itemId, stock.toString());
}

async function getCurrentReservedStockById(itemId) {
  const getAsync = promisify(redisClient.get);

  const reserved = await getAsync.call(redisClient, itemId);

  return reserved ? Number(reserved) : null;
}

app.get("/list_products", (req, res) => {
  res.status(200).json(listProducts);
});

app.get("/list_products/:itemId", async (req, res) => {
  const item = getItemById(req.params.itemId);

  if (!item) {
    return res.status(200).json({ status: "Product not found" });
  }

  const reservedStock = (await getCurrentReservedStockById(item.itemId)) ?? 0;
  const currentQuantity = item.initialAvailableQuantity - reservedStock;

  const product = {
    ...item,
    currentQuantity,
  };

  res.status(200).json(product);
});

app.get("/reserve_product/:itemId", async (req, res) => {
  const item = getItemById(req.params.itemId);

  if (!item) {
    return res.status(200).json({ status: "Product not found" });
  }

  const reservedStock = (await getCurrentReservedStockById(item.itemId)) ?? 0;
  const currentQuantity = item.initialAvailableQuantity - reservedStock;

  if (currentQuantity <= 0) {
    return res
      .status(200)
      .json({ status: "Not enough stock available", itemId: item.itemId });
  }

  reserveStockById(item.itemId, reservedStock + 1);

  res
    .status(200)
    .json({ status: "Reservation confirmed", itemId: item.itemId });
});

app.listen(1245, () => console.log("listening for requests"));
