const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Superadmin extends Model {
    static associate(models) {}
  }
  Superadmin.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Superadmin",
    }
  );
  return Superadmin;
};
