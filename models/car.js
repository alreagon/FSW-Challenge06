"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {}
  }
  Car.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      deleted: DataTypes.BOOLEAN,
      created_by: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "{}",
      },
      updated_by: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "{}",
      },
      deleted_by: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "{}",
      },
      image: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  return Car;
};
