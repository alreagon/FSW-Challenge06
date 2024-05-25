const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "secret";
const { Superadmin, Admin, Member } = require("../models");

// Unified authorization middleware
exports.authorize = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res
        .status(401)
        .send({ message: "Unauthorized - No token provided" });
    }

    const token = bearerToken.split(" ")[1];
    const tokenPayload = jwt.verify(token, secretKey);

    let user;
    switch (tokenPayload.role) {
      case "Superadmin":
        user = await Superadmin.findByPk(tokenPayload.user.id);
        break;
      case "Admin":
        user = await Admin.findByPk(tokenPayload.user.id);
        break;
      case "Member":
        user = await Member.findByPk(tokenPayload.user.id);
        break;
      default:
        return res.status(401).send({ message: "Unauthorized - Invalid role" });
    }

    if (!user) {
      return res.status(401).send({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    req.role = tokenPayload.role;
    next();
  } catch (error) {
    console.log("Authorization Error:", error.message);
    res.status(401).send({ message: "Unauthorized - Error: " + error.message });
  }
};

// Admin and Superadmin authorization middleware
exports.authorizeAdminOrSuperadmin = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res
        .status(401)
        .send({ message: "Unauthorized - No token provided" });
    }

    const token = bearerToken.split(" ")[1];
    const tokenPayload = jwt.verify(token, secretKey);

    if (tokenPayload.role === "Admin" || tokenPayload.role === "Superadmin") {
      req.user = tokenPayload.user;
      req.role = tokenPayload.role;
      next();
    } else {
      return res
        .status(401)
        .send({
          message: "Unauthorized - Admin or Superadmin access required",
        });
    }
  } catch (error) {
    console.log("Authorization Error:", error.message);
    res.status(401).send({ message: "Unauthorized - Error: " + error.message });
  }
};

// Simplified login function
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let userModel;
    switch (role) {
      case "Superadmin":
        userModel = Superadmin;
        break;
      case "Admin":
        userModel = Admin;
        break;
      case "Member":
        userModel = Member;
        break;
      default:
        return res.status(400).send({ message: "Invalid role" });
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ message: `${role} not found` });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Wrong password" });
    }

    const token = jwt.sign({ user, role }, secretKey);

    res.send({
      message: "Login success",
      role,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).send({ message: "Server error" });
  }
};

// Who Am I function
exports.whoAmI = (req, res) => {
  res.status(200).json({
    message: "Success",
    role: req.role,
    email: req.user.email,
    data: req.user,
  });
};
