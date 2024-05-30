const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "secret";
const { Superadmin } = require("../models");

// create
exports.createSuperadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const superadmin = await Superadmin.findOne({ where: { email } });
    if (superadmin) {
      return res.status(400).send({
        message: "Superadmin already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newSuperadmin = await Superadmin.create({
      name,
      email,
      password: hashPassword,
    });
    res.send({
      message: "Superadmin created",
      Data: {
        id: newSuperadmin.id,
        name: newSuperadmin.name,
        email: newSuperadmin.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server error",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Superadmin.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({
        message: "Superadmin not found",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        message: "Wrong password",
      });
    }
    const token = jwt.sign(
      {
        user,
        role: "Superadmin",
      },
      secretKey
    );
    res.send({
      message: "Login success",
      role: "superadmin",
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server error",
    });
  }
};
