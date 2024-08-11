require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;

// Connect to mongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database constants & vars
const schema = mongoose.Schema;
const urlSchema = new schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: String,
});
const url = mongoose.model("Url", urlSchema);

// middleware logger, request body parser
app.use(cors({ optionsSuccessStatus: 200 }));
app.use((req, res, next) => {
  //console.log(`${req.method} ${req.path} - ${req.ip}`);
  //next() allows the server to continue to the next function in the call stack
  next();
}, bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app
  .route("/api/shorturl")
  .get((req, res) => {
    res.send("Get request");
    // respond with redirect to long url search by id
  })
  .post((req, res) => {
    //TODO verify URL using given method

    // Inserting URL into databse and fetching its id
    let userInput; //get user input from req body
    let newUrl = new url({
      url: urserInput,
    });

    // Fetch the newly inserted's ID

    // respond with the id
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
