const express = require("express");
const User = require("./userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUser = async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
};

const getOneUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(400).json({ success: "false", message: "user not found" });
  }
  res.send(user);
};

const createUser = async (req, res) => {
  const passwordHash = bcrypt.hashSync(req.body.password, 12);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: passwordHash,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  await user.save();

  if (!user) res.status(404).send("the user cannot be created");

  res.send(user);
};

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("User not Found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },

      (key = process.env.SECRET_KEY),
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Email and Password is incorrect");
  }
};

const registerUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: passwordHash,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  await user.save();

  if (!user) {
    res.status(404).send("the user cannot be created");
  }
  res.send(user);
};


const getUserCount = async (req, res) => {
  const UserCount = await User.countDocuments();

  if (!UserCount) {
    res.status(400).json({ success: "false", message: "User not found" });
  }
  res.json({
    UserCount: UserCount,
  });
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "the user is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUser, createUser,
  getOneUser, loginUser,
  registerUser, getUserCount,
  deleteUser
 };
