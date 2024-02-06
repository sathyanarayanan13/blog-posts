const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createPost,
  getAllPosts,
  getSpecificPost,
  savePostResponse,
} = require("../controllers/posts.controller");
const router = express.Router();

const validatePost = [
  body("creatorId").notEmpty().withMessage("Post need the creator Id").trim(),
  body("postDetails").notEmpty().withMessage("Post needs some content to show"),
  body("postType")
    .notEmpty()
    .withMessage("Post type is required")
    .isIn(["free", "paid"])
    .withMessage("Invalid post type"),
  body("gemRequired")
    .if((value, { req }) => req.body.postType === "paid")
    .notEmpty()
    .withMessage("Gem required field is required")
    .isIn([3, 5, 10])
    .withMessage("Invalid gem requirement"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.postType === "free") req.body.gemRequired = 0;
    next();
  },
];

const validatePostResp = [
  body("userId")
    .notEmpty()
    .withMessage("To like/hate, you need to login")
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const parts = req.originalUrl.split("/");
    req.body.postResp = parts[3];
    next();
  },
];

router
  .route("/")
  .get(getAllPosts)
  .post(validatePost, createPost)
  .put((req, res) => {
    console.log("post is updated");
    res.status(200).json({ message: "post is updated" });
  });

router.get("/:postId", getSpecificPost);
router.put("/:postId/like", validatePostResp, savePostResponse);
router.put("/:postId/hate", validatePostResp, savePostResponse);
router.use((req, res) => {
  res
    .status(404)
    .json({
      error: "Requested page was not found",
      redirectTo: `Please redirect to /posts`,
    });
});

module.exports = router;
