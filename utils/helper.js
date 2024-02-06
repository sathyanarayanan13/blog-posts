const bcrypt = require("bcrypt");
const saltRounds = 8;

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

const encryptData = async (data) => {
  try {
    const hash = await bcrypt.hash(data, saltRounds);
    return hash;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const todayDate = async () => {
  try {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    return date;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  getOffset,
  emptyOrRows,
  encryptData,
  todayDate,
};
