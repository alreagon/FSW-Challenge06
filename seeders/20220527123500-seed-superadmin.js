"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashPassword = await bcrypt.hash("123456", 10);
    await queryInterface.bulkInsert("Superadmins", [
      {
        name: "Joko",
        email: "superadminJoko@gmail.com",
        password: hashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Superadmins",
      { email: "superadmin@gmail.com" },
      {}
    );
  },
};
