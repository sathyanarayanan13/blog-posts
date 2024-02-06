# Blog post endpoint

## Table of Contents

1. Introduction
2. Requirements
3. Installation
4. Endpoints
5. License


## Introduction

This project is a user and post management system that caters to three types of users: Admin, User, and Creator. Each user type has specific functionalities and privileges within the system:

### Admin: 

Has full access and control over all functionalities within the system.

### Creator: 

Can create posts, similar to a blogging platform, allowing them to share content with other users.

### User: 

Can view posts created by Creators and interact with them by liking or hating posts. Additionally, users have the opportunity to become Creators themselves.

Posts in the system are categorized into two types: paid and free. Paid posts have different visibility ranges, which are determined by the number of gems a user possesses. For example, users may gain access to paid posts when they accumulate a certain number of gems, such as 3, 5, or 10.

Moreover, users have the ability to follow Creators whose content they appreciate. When browsing posts, the system prioritizes displaying posts from followed Creators before showing other posts. This feature enhances user engagement by ensuring that content from followed Creators is readily accessible.


## Requirements

1. Install Node.js environment to your system
2. Use postman to access the endpoints
3. Install WAMP or LAMP to use MySQL


## Installation

1. First clone this repository
2. Install dependencies: npm install
3. Configure environment variables
4. Set up the databas
5. Start the server: npm start


## Endpoints

1. POST /users: Create new user
2. GET /users/:userId: Retrieve particular user details
3. GET /users: Retrive all user details
4. POST /posts: Create a new post
5. GET /posts: Retrive all posts
6. GET /posts/:postId: Retrive particular post infomration
7. PUT /posts/:postId/hate: React to the post
8. PUT /posts/:postId/like: React to the post
9. POST /users/:userId/follow: To follow a creator
10. GET /users/:userId/followers: To retrive the following details of the particular user
11. POST /users/gems/add: Add gems to the particular user
12. GET /users/:userId/gems: Retrive remaining gems information of the particular user


## License

This project is licensed under the MIT License.
