const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });

  await newUser.save();

  res.status(201).json("user created successfully");
};
