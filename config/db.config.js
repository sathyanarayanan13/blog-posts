const dotenv = require('dotenv');
dotenv.config();

const config = {
  db: {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: "blog_posts",
    connectionLimit: 60,
  },
  listPerPage: 10,
};

module.exports = config;
