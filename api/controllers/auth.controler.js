const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return next(errorHandler(404, "Invalid credentials."));
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("user created successfully");
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Invalid email provided."));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password."));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc; // This is store as _doc so we used _doc
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};

exports.google = async (req, res, next) => {
  const { userName, email, avatar } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const pass =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(pass, 10);

      const newUser = new User({
        userName:
          userName.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
