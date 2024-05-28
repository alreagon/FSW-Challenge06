const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "secret";
const { Member } = require("../models");

// create
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Member.findOne({ where: { email } });
    if (user) {
      return res.status(400).send({
        message: "Member already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newMember = await Member.create({
      name,
      email,
      password: hashPassword,
    });
    res.send({
      message: "Member created",
      Data: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server error",
    });
  }
};
