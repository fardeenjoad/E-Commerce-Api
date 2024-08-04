const express = require("express");
const {
  order,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
} = require("./orderController");

const orderRouter = express.Router();

orderRouter.get("/order", order);
orderRouter.get("/order/:id", getOrder);
orderRouter.post("/order", createOrder);
orderRouter.put("/order/:id", updateOrder);
orderRouter.delete("/order/:id", deleteOrder);
orderRouter.get("/order/get/totalSales", getTotalSales);
orderRouter.get("/order/get/count", getOrderCount);
orderRouter.get("/order/get/userorders/:userid", getUserOrders);

module.exports = orderRouter;
