const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user.router");
const postRouter = require("./routes/posts.router");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Landing page" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

try {
  app.use("/users", userRoute);
  app.use("/posts", postRouter);
} catch (error) {
  console.error("Error occurred:", error);
}

app.use((req, res) => {
  try {
    res
      .status(404)
      .json({
        error: "404 page not found",
        redirectTo: `Please redirect to home`,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

try {
  app.listen(port, () => {
    console.log(`Server started in the port - ${port}`);
  });
} catch (error) {
  console.error("Error occurred:", error);
}
