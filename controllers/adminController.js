const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY || "secret";
const { Admin } = require("../models");

// create
exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (admin) {
      return res.status(400).send({
        message: "Admin already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashPassword,
    });
    res.send({
      message: "Admin created",
      Data: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server error",
    });
  }
};
