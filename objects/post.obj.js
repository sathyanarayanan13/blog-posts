const pool = require("../services/db.service");

class Post {
  constructor(postId) {
    this.postId = postId;
    this.creatorId = null;
    this.postType = null;
    this.postDetails = null;
    this.creationTime = null;
    this.modifiedTime = null;
    this.requiredGems = null;
    this.creatorName = null;
    this.like = 0;
    this.hate = 0;
    this.fetchPostDetails();
    this.fetchPostResponseDetails();
  }

  async fetchPostDetails() {
    try {
      const [postResult, visibilityResult] = await Promise.all([
        this.getPostDetails(),
        this.getPostVisibilityDetails(),
      ]);

      if (postResult.length > 0) {
        const postData = postResult[0];
        this.creatorId = postData.creatorId;
        this.postType = postData.postType;
        this.postDetails = postData.postDetails;
        this.creationTime = postData.creationTime;
        this.modifiedTime = postData.modifiedTime;
        this.requiredGems = visibilityResult ? visibilityResult.requiredGems : null;
        this.creatorName = postData["Creator name"];
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  }

  async fetchPostResponseDetails() {
    try {
      const responseResult = await this.getPostResponseDetails();
      responseResult.forEach((response) => {
        if (response.respDetails === "like") {
          this.like++;
        } else if (response.respDetails === "hate") {
          this.hate++;
        }
      });
    } catch (error) {
      console.error("Error fetching post response details:", error);
    }
  }

  async getPostDetails() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT p.*, CONCAT(fname,',', lname) as `Creator name` FROM tbl_post p LEFT JOIN tbl_user u ON u.userId = p.creatorId WHERE p.postId = ?",
        this.postId,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  async getPostVisibilityDetails() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT requiredGems FROM tbl_post_visibility WHERE postId = ?",
        this.postId,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.length > 0 ? result[0] : null);
          }
        }
      );
    });
  }

  async getPostResponseDetails() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT respDetails FROM tbl_post_response WHERE postId = ?",
        this.postId,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = Post;
