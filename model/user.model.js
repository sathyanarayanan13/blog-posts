const User = require("../objects/user.obj");
const pool = require("../services/db.service");
const { todayDate } = require("../utils/helper");

exports.createUser = async (userData, callback) => {
  const { fname, lname, email, password, userType } = userData;
  const date = await todayDate();
  pool.query(
    "INSERT INTO tbl_user (fname, lname, email, password, userType, status, creationTime, modifiedTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [fname, lname, email, password, userType, 1, date, date],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results.insertId);
    }
  );
};

exports.getSpecificUser = (user, callback) => {
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    const { userId } = user;
    connection.query(
      "SELECT * FROM tbl_user WHERE userId = ?",
      userId,
      async (error, results) => {
        if (error) {
          return callback(error);
        }
        const userData = new User(userId);
        await userData.fetchUserData();
        callback(null, userData);
      }
    );
  });
};

exports.getAllUser = (callback) => {
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    connection.query("SELECT * FROM tbl_user", (error, results) => {
      if (error) {
        return callback(error);
      }
      pool.end();
      callback(null, results);
    });
  });
};

exports.followUser = (followerId, followedId, callback) => {
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    connection.query(
      "SELECT * FROM tbl_followers WHERE followerId = ? AND followedId = ?",
      [followerId, followedId],
      (error, result) => {
        if (error) {
          connection.release();
          return callback(error);
        }
        if (result.length > 0) {
          connection.query(
            "DELETE FROM tbl_followers WHERE followerId = ? AND followedId = ?",
            [followerId, followedId],
            (error, result) => {
              if (error) {
                connection.release();
                return callback(error);
              }
              return callback(null, {
                message: "Unfollowed the creator",
              });
            }
          );
        } else {
          connection.query(
            "INSERT INTO tbl_followers (followerId, followedId) VALUES (?, ?)",
            [followerId, followedId],
            (error, results) => {
              if (error) {
                return callback(error);
              }
              callback(null, {
                message: "You are now following this creator",
              });
            }
          );
        }
      }
    );
  });
};

exports.getUserFollowers = (userId, callback) => {
  pool.query(
    "SELECT `followedId` FROM tbl_followers WHERE followerId = ?",
    userId,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

exports.addUserGems = async (gemsData, callback) => {
  const { userId, gemsCount } = gemsData;
  const date = await todayDate();
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    connection.query(
      "INSERT INTO `tbl_gems`(`userId`, `gemCount`, `creationTime`, `modifiedTime`) VALUES (?, ?, ?, ?)",
      [userId, gemsCount, date, date],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        callback(null, results);
      }
    );
  });
};

exports.userGemDetails = (user, callback) => {
  const { userId } = user;
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    connection.query(
      "SELECT * FROM tbl_gems WHERE userId = ?",
      userId,
      (error, results) => {
        if (error) {
          return callback(error);
        }
        callback(null, results);
      }
    );
  });
};
