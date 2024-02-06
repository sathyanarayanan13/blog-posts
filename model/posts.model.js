const pool = require("../services/db.service");
const { todayDate } = require("../utils/helper");
const Post = require("../objects/post.obj");
const User = require("../objects/user.obj");

exports.createPost = async (postData, callback) => {
  const { creatorId, postDetails, postType, gemRequired } = postData;
  const date = await todayDate();
  pool.query(
    "INSERT INTO tbl_post (creatorId, postType, postDetails, creationTime, modifiedTime) VALUES (?, ?, ?, ?, ?)",
    [creatorId, postType, postDetails, date, date],
    async (error, results) => {
      if (error) {
        return callback(error);
      }
      await postVisibility(results.insertId, gemRequired);
      callback(null, results.insertId);
    }
  );
};

const postVisibility = async (postId, gemsRequired) => {
  try {
    await new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO tbl_post_visibility (postId, requiredGems) VALUES (?, ?)",
        [postId, gemsRequired],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllPosts = (userId, callback) => {
  if (!userId) {
    pool.getConnection((err, connection) => {
      if (err instanceof Error) {
        console.log(err);
        return callback(err);
      }
      connection.query(
        "SELECT p.*, pv.requiredGems FROM tbl_post p LEFT JOIN tbl_post_visibility pv ON p.postId = pv.postId ORDER BY p.creationTime DESC",
        (error, results) => {
          connection.release();
          if (error) {
            return callback(error);
          }
          callback(null, results);
        }
      );
    });
  } else {
    const userData = new User(userId);
    userData.fetchUserData().then(() => {
      const followedIds = userData.followedIds;
      if (followedIds.length > 0) {
        pool.getConnection((err, connection) => {
          if (err instanceof Error) {
            console.log(err);
            return callback(err);
          }
          connection.query(
            `SELECT p.*, pv.requiredGems FROM tbl_post p 
            LEFT JOIN tbl_post_visibility pv ON p.postId = pv.postId
            LEFT JOIN tbl_followers f ON (f.followedId = p.creatorId AND f.followerId = ?)
            ORDER BY f.followedId DESC, p.creationTime DESC`,
            [userId],
            (error, results) => {
              connection.release();
              if (error) {
                return callback(error);
              }
              callback(null, results);
            }
          );
        });
      } else {
        pool.getConnection((err, connection) => {
          if (err instanceof Error) {
            console.log(err);
            return callback(err);
          }
          connection.query(
            "SELECT p.*, pv.requiredGems FROM tbl_post p LEFT JOIN tbl_post_visibility pv ON p.postId = pv.postId ORDER BY p.creationTime DESC",
            (error, results) => {
              connection.release();
              if (error) {
                return callback(error);
              }
              callback(null, results);
            }
          );
        });
      }
    }).catch(error => {
      console.error("Error fetching user data:", error);
      callback(error);
    });
  }
};

exports.getSpecificPost = async (post, callback) => {
  pool.getConnection(function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    const { postId, userId } = post;
    connection.query(
      "SELECT * FROM tbl_post WHERE postId = ?",
      postId,
      async (error, result) => {
        if (error) {
          return callback(error);
        }
        if (result.length > 0) {
          const { postId } = post;
          const postData = new Post(postId);
          await postData.fetchPostDetails();
          if (postData.postType === "free") {
            return callback(null, postData);
          } else {
            if (!userId) {
              return callback(null, {
                message: "You need to login to see the paid posts",
              });
            } else {
              connection.query(
                "SELECT * FROM tbl_paid_posts WHERE userId = ? AND postId = ?",
                [userId, postId],
                async (err, paidPosts) => {
                  if (err) {
                    return callback(err);
                  }
                  if (paidPosts.length > 0) {
                    return callback(null, postData);
                  } else {
                    const userData = new User(userId);
                    await userData.fetchUserData();
                    if (userData.gems >= postData.requiredGems) {
                      userData.gems =
                        parseInt(userData.gems) -
                        parseInt(postData.requiredGems);
                      await userData.updateGems(userData.gems);
                      await userData.addPaidPosts(postData.postId);
                      return callback(null, postData);
                    } else {
                      return callback(null, {
                        message: "Avilable gems is not enough, Please buy gems",
                      });
                    }
                  }
                }
              );
            }
          }
        } else {
          return callback(null, result);
        }
      }
    );
  });
};

exports.savePostResponse = (postsResp, callback) => {
  pool.getConnection(async function (err, connection) {
    if (err instanceof Error) {
      console.log(err);
      return;
    }
    const { postId, postResp, userId } = postsResp;
    const date = await todayDate();
    connection.query(
      "SELECT postId, userId, respDetails FROM tbl_post_response WHERE postId = ? AND userId = ?",
      [postId, userId],
      (error, results) => {
        if (error) {
          connection.release();
          return callback(error);
        }
        if (results.length > 0) {
          const existingResponse = results[0];
          if (existingResponse.respDetails === postResp) {
            connection.release();
            return callback(null, {
              message: "Already responded with same response",
            });
          } else {
            connection.query(
              "UPDATE tbl_post_response SET respDetails = ?, modifiedTime = ? WHERE postId = ? AND userId = ?",
              [postResp, date, postId, userId],
              (updateError, updateResult) => {
                connection.release();
                if (updateError) {
                  return callback(updateError);
                }
                return callback(null, {
                  message: "Response updated successfully",
                });
              }
            );
          }
        } else {
          connection.query(
            "INSERT INTO tbl_post_response (postId, userId, respDetails, creationTime, modifiedTime) VALUES (?, ?, ?, ?, ?)",
            [postId, userId, postResp, date, date],
            (insertError, insertResult) => {
              connection.release();
              if (insertError) {
                return callback(insertError);
              }
              return callback(null, { message: "Response saved successfully" });
            }
          );
        }
      }
    );
  });
};
