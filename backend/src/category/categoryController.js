const express = require("express");
const { Category } = require("./catgeorySchema");

const categoryList = async (req, res) => {
  const categories = await Category.find();

  if (!categories) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categories);
};

const findCatgoryList = async (req, res) => {
  const categories = await Category.findById(req.params.id);

  if (!categories) {
    res
      .status(500)
      .json({ message: " The category with the given ID was not found" });
  }
  res.status(200).send(categories);
};

const createCategory = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  await category.save();

  if (!category) res.status(404).send("the category cannot be created");

  res.send(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  },
  { new: true }
);
  if (!category) {
    return;
    res.status(500).send("the category cannot be updated");
  }
  res.send(category);
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "the category is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  categoryList,
  findCatgoryList,
  createCategory,
  deleteCategory,
  updateCategory,
};
