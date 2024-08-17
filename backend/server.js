var express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/dbconfig");
const UserRouter = require("./routes/UserRoutes");
const PORT = 8080;

connectDB();
app.use(cors());
app.use(express.json()); 
// This to handle json data coming from requests mainly post


app.get("/", (req, res) => {
  res.send("api is running ");
});

app.use("/api/user", UserRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err, "err in server connecting");
  } else {
    console.log("listening to " + PORT);
  }
});
