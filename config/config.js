require("dotenv").config();

const { DB_USERNAME, DB_NAME, DB_HOST, DB_DIALECT } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
};
