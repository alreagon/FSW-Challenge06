const { Car } = require("../models");
const fs = require("fs");
const path = require("path");

// list all cars in trashbag where deleted true
exports.listTrashbag = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: {
        deleted: true,
      },
    });
    res.send({
      message: "List of cars in trashbag",
      role: req.role,
      email: req.user.email,
      data: cars,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server error",
      role: req.role,
      email: req.user.email,
    });
  }
};

// permanently delete car by id from trashbag
exports.deleteTrashbag = async (req, res) => {
  try {
    const existingCar = await Car.findByPk(req.params.id);
    if (!existingCar || !existingCar.deleted) {
      return res
        .status(404)
        .json({
          message: "Car not found in trashbag",
          role: req.role,
          email: req.user.email,
        });
    }

    if (existingCar.image) {
      fs.unlinkSync(path.join("public/uploads", existingCar.image)); // delete image
    }

    await Car.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: "Car permanently deleted",
      role: req.role,
      email: req.user.email,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      role: req.role,
      email: req.user.email,
    });
  }
};
