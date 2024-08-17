const mongoose = require("mongoose");

const URL = "mongodb+srv://8192969855p:prakash@cluster0.rc0ra.mongodb.net/simplifyAssigment?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    });

    console.log("connected mongo db");
  } catch (error) {
    console.log(error, "mongo does not connect properly");
    process.exit(1);
  }
};

module.exports = connectDB;
