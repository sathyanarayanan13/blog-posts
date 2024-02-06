const pool = require("../services/db.service");
const { todayDate } = require("../utils/helper");

class User {
  constructor(userId) {
    this.userId = userId;
    this.fname = null;
    this.lname = null;
    this.email = null;
    this.password = null;
    this.userType = null;
    this.status = null;
    this.creationTime = null;
    this.modifiedTime = null;
    this.gems = 0;
    this.followedIds = [];
    this.paidPosts = [];
    this.remainingGemCount = 0;
    this.fetchUserData();
  }

  async fetchUserData() {
    try {
      const [userResult, gemsResult, followersResult, paidPostsResult] = await Promise.all([
        this.getUserDetails(),
        this.getUserGemDetails(),
        this.getUserFollowers(),
        this.getPaidPosts(),
      ]);

      if (userResult.length > 0) {
        const userData = userResult[0];
        this.fname = userData.fname;
        this.lname = userData.lname;
        this.email = userData.email;
        this.password = userData.password;
        this.userType = userData.userType;
        this.status = userData.status;
        this.creationTime = userData.creationTime;
        this.modifiedTime = userData.modifiedTime;
      }

      if (gemsResult.length > 0) {
        this.gems = gemsResult.reduce((total, gem) => total + gem.gemCount, 0);
        this.remainingGemCount = this.gems;
      }

      this.followedIds = followersResult.map((follower) => follower.followedId);
      this.paidPosts = paidPostsResult.map((post) => post.postId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async getUserDetails() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM tbl_user WHERE userId = ?",
        this.userId,
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

  async getUserGemDetails() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM tbl_gems WHERE userId = ?",
        this.userId,
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

  async getUserFollowers() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT followedId FROM tbl_followers WHERE followerId = ?",
        this.userId,
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

  async getPaidPosts() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT postId FROM tbl_paid_posts WHERE userId = ?",
        this.userId,
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

  async updateGems(gemsCount) {
    const date = await todayDate();
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE tbl_gems SET gemCount = ?, modifiedTime = ? WHERE userId = ? ",
        [gemsCount, date, this.userId],
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

  async addPaidPosts(postId) {
    const date = await todayDate();
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO `tbl_paid_posts`(`userId`, `postId`, `creationTime`) VALUES (?, ?, ?)",
        [this.userId, postId, date],
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

module.exports = User;
