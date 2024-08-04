const express = require("express");
const { Order } = require("../../src/order/orderSchema");
const OrderItem = require("./order-item");
const { populate } = require("dotenv");

const order = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
};

const createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = (await orderItem.product.price) * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  console.log(totalPrices);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  await order.save();

  if (!order) {
    res.status(404).send("the order cannot be created");
  }
  res.send(order);
};

const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return;
    res.status(500).send("the order cannot be updated");
  }
  res.send(order);
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
      const deleteOrderItemsPromises = order.orderItems.map(
        async (orderItem) => {
          return OrderItem.findByIdAndDelete(orderItem);
        }
      );

      await Promise.all(deleteOrderItemsPromises);

      return res
        .status(200)
        .json({ success: true, message: "The order is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getTotalSales = async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalSales: { $sum: '$totalPrice' }} }
    ])
    if(!totalSales) {
        return  res.status(400).send("The Order sales cannot be generated")
    }
    res.send({totalSales: totalSales.pop().totalSales});
}

const getOrderCount = async (req, res) => {
    const orderCount = await Order.countDocuments();
  
    if (!orderCount) {
      res.status(400).json({ success: "false", message: "Order not found" });
    }
    res.json({
      orderCount: orderCount,
    });
  };

  const getUserOrders = async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",}
        }).sort({ 'dateOrdered': -1 });
  
    if (!userOrderList) {
      res.status(500).json({ success: false });
    }
    res.send(userOrderList);
  };

module.exports = {
  order,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
};
