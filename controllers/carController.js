const { Car } = require("../models");
const fs = require("fs");
const path = require("path");

// list all cars where deleted false
exports.listCar = async (req, res) => {
  try {
    let cars;
    if (req.role === "Member") {
      cars = await Car.findAll({
        where: {
          deleted: false,
          created_by: req.user.email,
        },
      });
    } else {
      cars = await Car.findAll({
        where: {
          deleted: false,
        },
      });
    }
    res.send({
      message: "List of cars",
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

// create car
exports.createCar = async (req, res) => {
  const car = {
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    deleted: false,
    created_by: req.user.email,
    image: req.file ? req.file.filename : null,
  };
  try {
    const newCar = await Car.create(car);
    res.status(201).json({
      message: "Car Created",
      role: req.role,
      email: req.user.email,
      data: newCar,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      role: req.role,
      email: req.user.email,
    });
  }
};

// update car by id
exports.updateCar = async (req, res) => {
  const car = {
    id: req.params.id,
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    deleted: false,
    updated_by: req.user.email,
    image: req.file ? req.file.filename : null,
  };
  try {
    const existingCar = await Car.findByPk(req.params.id);
    if (!existingCar) {
      return res
        .status(404)
        .json({
          message: "Car not found",
          role: req.role,
          email: req.user.email,
        });
    }
    if (req.role === "Member" && existingCar.created_by !== req.user.email) {
      return res
        .status(403)
        .json({ message: "Forbidden", role: req.role, email: req.user.email });
    }

    if (req.file && existingCar.image) {
      fs.unlinkSync(path.join("public/uploads", existingCar.image)); // delete old image
    }

    await Car.update(car, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: "Car Updated",
      role: req.role,
      email: req.user.email,
      data: car,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      role: req.role,
      email: req.user.email,
    });
  }
};

// delete car by id
exports.deleteCar = async (req, res) => {
  try {
    const existingCar = await Car.findByPk(req.params.id);
    if (!existingCar) {
      return res
        .status(404)
        .json({
          message: "Car not found",
          role: req.role,
          email: req.user.email,
        });
    }
    if (req.role === "Member" && existingCar.created_by !== req.user.email) {
      return res
        .status(403)
        .json({ message: "Forbidden", role: req.role, email: req.user.email });
    }

    await Car.update(
      {
        deleted: true,
        deleted_by: req.user.email,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      message: "Car moved to trashbag",
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
