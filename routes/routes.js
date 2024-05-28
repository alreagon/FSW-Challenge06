const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superadminController");
const adminController = require("../controllers/adminController");
const memberController = require("../controllers/memberController");
const authController = require("../controllers/authController");
const carController = require("../controllers/carController");
const uploadMiddleware = require("../middleware/upload");

const prefix = "/api/v1";

// Super Admin Routes
router.post(prefix + "/superadmin/login", (req, res) => {
  req.body.role = "Superadmin";
  authController.login(req, res);
});
router.post(
  prefix + "/superadmin/create",
  superAdminController.createSuperadmin
);

// Admin Routes
router.post(prefix + "/admin/login", (req, res) => {
  req.body.role = "Admin";
  authController.login(req, res);
});
router.post(prefix + "/admin/create", adminController.create);

// Member Routes
router.post(prefix + "/member/register", memberController.register);
router.post(prefix + "/member/login", (req, res) => {
  req.body.role = "Member";
  authController.login(req, res);
});

// Car Routes
router.get(prefix + "/cars", authController.authorize, carController.listCar);
router.post(
  prefix + "/cars",
  authController.authorize,
  uploadMiddleware,
  carController.createCar
);
router.put(
  prefix + "/cars/:id",
  authController.authorize,
  uploadMiddleware,
  carController.updateCar
);
router.delete(
  prefix + "/cars/:id",
  authController.authorize,
  carController.deleteCar
);

// User Routes
router.get(prefix + "/users", authController.getAllUsers); // No token required
router.get(
  prefix + "/users/me",
  authController.authorize,
  authController.getCurrentUser
); // Token required

module.exports = router;
