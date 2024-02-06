const {
  createPost,
  getAllPosts,
  getSpecificPost,
  savePostResponse,
} = require("../model/posts.model");
const { getSpecificUser } = require("../model/user.model");

exports.createPost = (req, res) => {
  const { creatorId, postDetails, postType, gemRequired } = req.body;
  getSpecificUser({ userId: creatorId }, (error, users) => {
    if (error) {
      console.error("Error on creating posts:", error);
      return res.status(500).json({ error: "Error on creating posts" });
    }

    if (users.length <= 0) {
      console.error("Not a valid user:", error);
      return res
        .status(500)
        .json({ error: "Provided user detail is not valid" });
    }

    createPost(
      { creatorId, postDetails, postType, gemRequired },
      (error, userId) => {
        if (error) {
          console.error("Error creating posts:", error);
          return res.status(500).json({ error: "Error creating posts" });
        }
        res.status(201).json({ message: "Your post is created" });
      }
    );
  });
};

exports.getAllPosts = (req, res) => {
  let userId = '';
  if(req.body.userId) {
    userId = req.body.userId;
  }
  getAllPosts( userId, (error, posts) => {
    if (error) {
      console.error("Error getting all posts:", error);
      return res.status(500).json({ error: "Error getting all posts" });
    }
    if (posts.length <= 0) {
      posts = "Posts are not available";
    }
    res.status(200).json({ posts: posts });
  });
};

exports.getSpecificPost = (req, res) => {
  const postId = req.params.postId;
  let userId = '';
  if(req.body.userId) {
    userId = req.body.userId;
  }
  getSpecificPost({ postId, userId }, (error, postData) => {
    if (error) {
      console.error("Error getting post data:", error);
      return res.status(500).json({ error: "Error getting post data" });
    }
    res.status(200).json({ postData: postData });
  });
};

exports.savePostResponse = (req, res) => {
  const postId = req.params.postId;
  const { postResp, userId } = req.body;
  getSpecificUser({ userId }, (error, users) => {
    if (error) {
      console.error("Error on updating post response:", error);
      return res.status(500).json({ error: "Error on updating post response" });
    }

    if (users.length <= 0) {
      console.error("Not a valid user:", error);
      return res
        .status(500)
        .json({ error: "Provided user detail is not valid" });
    }

    savePostResponse({ postId, postResp, userId }, (error, result) => {
      if (error) {
        console.error("Error updating your post response", error);
        return res
          .status(500)
          .json({ error: "Error updating your post response" });
      }
      res.status(201).json({ message: result });
    });
  });
};
