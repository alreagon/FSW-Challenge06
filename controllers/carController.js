const { Car } = require("../models");
const fs = require("fs");
const path = require("path");

// get cars
exports.listCar = async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.send({
      message: "List of cars",
      role: req.role,
      email: req.user.email,
      data: cars.map((car) => ({
        ...car.get(),
        created_by: JSON.parse(car.created_by || "{}"),
        updated_by: car.updated_by ? JSON.parse(car.updated_by) : null,
        deleted_by: car.deleted_by ? JSON.parse(car.deleted_by) : null,
      })),
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
    created_by: JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.role,
    }),
    image: req.file ? req.file.filename : null,
  };
  try {
    const newCar = await Car.create(car);
    res.status(201).json({
      message: "Car Created",
      role: req.role,
      email: req.user.email,
      data: {
        ...newCar.get(),
        created_by: JSON.parse(newCar.created_by),
      },
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
    updated_by: JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.role,
    }),
    image: req.file ? req.file.filename : null,
  };
  try {
    const existingCar = await Car.findByPk(req.params.id);
    if (!existingCar) {
      return res.status(404).json({
        message: "Car not found",
        role: req.role,
        email: req.user.email,
      });
    }
    if (
      req.role === "Member" &&
      JSON.parse(existingCar.created_by).id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden", role: req.role, email: req.user.email });
    }

    if (req.file && existingCar.image) {
      fs.unlinkSync(path.join("public/uploads", existingCar.image));
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
      data: {
        ...car,
        updated_by: JSON.parse(car.updated_by),
      },
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
      return res.status(404).json({
        message: "Car not found",
        role: req.role,
        email: req.user.email,
      });
    }
    if (
      req.role === "Member" &&
      JSON.parse(existingCar.created_by).id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden", role: req.role, email: req.user.email });
    }

    await Car.update(
      {
        deleted: true,
        deleted_by: JSON.stringify({
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.role,
        }),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      message: "Car deleted",
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
