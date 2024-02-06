const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/user.controller");

const validateNewUser = [
  body("fname").notEmpty().withMessage("Fist name is required").trim(),
  body("lname").notEmpty().withMessage("Last name is required").trim(),
  body("password").notEmpty().withMessage("password is required").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.userType) req.body.userType = "user";
    next();
  },
];

const validateFollowReq = [
  body("creatorId").notEmpty().withMessage("Creator ID is required").trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.userId = req.params.userId;
    next();
  },
];

const validateGemsReq = [
  body("userId").notEmpty().withMessage("User ID is required").trim(),
  body("gemsCount").notEmpty().withMessage("Gems quantity is required").trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router
  .route("/")
  .get(userController.getAllUsers)
  .post(validateNewUser, userController.createUser)
  .put((req, res) => {
    console.log("User data updated");
    res.status(200).end();
  });

router.get("/:userId", userController.getSpecificUser);
router.get("/:userId/followers", userController.getUserFollowers);
router.post("/:userId/follow", validateFollowReq, userController.followUser);
router.get("/:userId/gems", userController.userGemDetails);
router.post("/gems/add", validateGemsReq, userController.addUserGems);
router.use((req, res) => {
  res.status(404).json({
    error: "page not found",
    redirectTo: `Please redirect to /users`,
  });
});

module.exports = router;
