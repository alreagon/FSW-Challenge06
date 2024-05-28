const { Car } = require("../models");
const fs = require("fs");
const path = require("path");

// Helper function to create image link
const createImageLink = (filename) =>
  `http://localhost:3000/public/uploads/${filename}`;

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
        image: car.image ? createImageLink(car.image) : null,
        created_by: car.created_by ? JSON.parse(car.created_by) : null,
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

// get car by id
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.send({
      message: "Car details",
      data: {
        ...car.get(),
        image: car.image ? createImageLink(car.image) : null,
        created_by: car.created_by ? JSON.parse(car.created_by) : null,
        updated_by: car.updated_by ? JSON.parse(car.updated_by) : null,
        deleted_by: car.deleted_by ? JSON.parse(car.deleted_by) : null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};

// create car
exports.createCar = async (req, res) => {
  if (req.role === "Member") {
    return res.status(403).json({
      message: "Forbidden: Members cannot create cars",
      role: req.role,
      email: req.user.email,
    });
  }

  const car = {
    name: req.body.name,
    rentPerDay: req.body.rentPerDay,
    type: req.body.type,
    is_deleted: false,
    created_by: JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.role,
    }),
    updated_by: null,
    deleted_by: null,
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
        updated_by: newCar.updated_by ? JSON.parse(newCar.updated_by) : null,
        deleted_by: newCar.deleted_by ? JSON.parse(newCar.deleted_by) : null,
        image: newCar.image ? createImageLink(newCar.image) : null,
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
  if (req.role === "Member") {
    return res.status(403).json({
      message: "Forbidden: Members cannot update cars",
      role: req.role,
      email: req.user.email,
    });
  }

  const car = {
    id: req.params.id,
    name: req.body.name,
    rentPerDay: req.body.rentPerDay,
    type: req.body.type,
    is_deleted: false,
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
        updated_by: car.updated_by ? JSON.parse(car.updated_by) : null,
        image: car.image ? createImageLink(car.image) : null,
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
  if (req.role === "Member") {
    return res.status(403).json({
      message: "Forbidden: Members cannot delete cars",
      role: req.role,
      email: req.user.email,
    });
  }

  try {
    const existingCar = await Car.findByPk(req.params.id);
    if (!existingCar) {
      return res.status(404).json({
        message: "Car not found",
        role: req.role,
        email: req.user.email,
      });
    }

    await Car.update(
      {
        is_deleted: true,
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
