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
