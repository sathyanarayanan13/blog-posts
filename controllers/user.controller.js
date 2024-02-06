const userModel = require("../model/user.model");
const { encryptData } = require("../utils/helper");

exports.getAllUsers = (req, res) => {
  userModel.getAllUser((error, users) => {
    if (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Error getting all users" });
    }
    res.status(200).json({ users: users });
  });
};

exports.getSpecificUser = (req, res) => {
  const userId = req.params.userId;
  userModel.getSpecificUser({ userId }, (error, users) => {
    if (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Error getting all users" });
    }
    res.status(200).json({ users: users });
  });
};

exports.createUser = async (req, res) => {
  const { fname, lname, email, userType } = req.body;
  let password = await encryptData(req.body.password);
  userModel.createUser(
    { fname, lname, email, password, userType },
    (error, userId) => {
      if (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Error creating user" });
      }
      res.status(201).json({ message: `Your user id is ${userId}` });
    }
  );
};

exports.getUserFollowers = (req, res) => {
  const userId = req.params.userId;
  userModel.getUserFollowers(userId, (error, result) => {
    if (error) {
      console.error("Error on getting the folloing details:", error);
      return res
        .status(500)
        .json({ error: "Error on getting the folloing details" });
    }
    if (result.length <= 0) {
      res.status(200).json({
        message: "You are not following any one",
      });
    }
    res.status(200).json({
      message: result,
    });
  });
};

exports.followUser = (req, res) => {
  const { creatorId, userId } = req.body;
  userModel.getSpecificUser({ userId: creatorId }, (error, users) => {
    if (error) {
      console.error("Error on following the creator:", error);
      return res.status(500).json({ error: "Error on following the creator" });
    }

    if (users.length <= 0) {
      console.error("Not a valid creator:", error);
      return res.status(500).json({ error: "Not a valid creator" });
    }

    userModel.followUser(userId, creatorId, (error, result) => {
      if (error) {
        console.error("Error folloing the creator:", error);
        return res.status(500).json({ error: "Error folloing the creator" });
      }
      res.status(201).json({
        message: result,
        redirectTo: `/users/${req.params.userId}/followers`,
      });
    });
  });
};

exports.addUserGems = (req, res) => {
  const { userId, gemsCount } = req.body;
  userModel.getSpecificUser({ userId }, (error, users) => {
    if (error) {
      console.error("Error on adding gems:", error);
      return res.status(500).json({ error: "Error on adding gems" });
    }
    if (users.length <= 0) {
      console.error("Not a valid user:", error);
      return res.status(500).json({ error: "Not a valid user" });
    }
    userModel.addUserGems({ userId, gemsCount }, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error on adding gems" });
      }
      res.status(201).json({
        message: "Gem is added successfully",
      });
    });
  });
};

exports.userGemDetails = (req, res) => {
  const userId = req.params.userId;
  userModel.getSpecificUser({ userId }, (error, users) => {
    if (error) {
      console.error("Error getting remaining gems:", error);
      return res.status(500).json({ error: "Error getting remaining gems" });
    }
    if (users.length <= 0) {
      console.error("Not a valid user:", error);
      return res.status(500).json({ error: "Not a valid user" });
    }
    userModel.userGemDetails({ userId }, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error getting remaining gems" });
      }
      res.status(200).json({
        message: result,
      });
    });
  });
};
