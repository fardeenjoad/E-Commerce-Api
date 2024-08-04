const express = require("express");
const {
  createProduct,
  getProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProduct,
} = require("../product/productController");
const productRouter = express.Router();

productRouter.post("/product", createProduct);
productRouter.get("/product", getProduct);
productRouter.get("/product/:id", getOneProduct);
productRouter.put("/product/:id", updateProduct);
productRouter.delete("/product/:id", deleteProduct);
productRouter.get('/product/get/count', getProductCount)
productRouter.get('/product/get/featured/:count', getFeaturedProduct)

module.exports = productRouter;
