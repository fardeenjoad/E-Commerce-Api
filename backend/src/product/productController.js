const express = require("express");
const Product = require("../../src/product/productSchema");
const { Category } = require("../category/catgeorySchema");
const mongoose = require("mongoose");

const getProduct = async (req, res) => {

  let filter = {};
  if(req.query.category){
    filter = {category: req.query.category.split(',')}
  }

  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.status(400).json({ success: "false" });
  }
  res.send(productList);
};

const getOneProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(400).json({ success: "false", message: "product not found" });
  }
  res.send(product);
};

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category"); // Corrected the misplaced return
  }

  try {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
      return res
        .status(400)
        .json({ success: "false", message: "The product cannot be created" });
    } else {
      return res.status(201).json({ message: "Product created", product });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) {
    return res.status(400).send("the product cannot be updated");
  }

  res.send(product);
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "the product is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getProductCount = async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(400).json({ success: "false", message: "product not found" });
  }
  res.json({
    productCount: productCount,
  });
};


const getFeaturedProduct = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const product = await Product.find({isFeatured: true}).limit(count)

  if (!product) {
    res.status(400).json({ success: "false", message: "product not found" });
  }
  res.json(product);
};

module.exports = {
  getProduct,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProduct,
};
