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
  shortUrl: {
    type: String,
    required: true,
  },
});
const url = mongoose.model("Url", urlSchema);

// Count for the number of shortUrls assigned- also used to create shortUrls
let countCreated = 0;

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
  .get((req, res, next) => {
    res.send("Get request");
    // respond with redirect to long url search by id
    next();
  })
  .post((req, res) => {
    //get user input from req body
    let userInput = req.body.url;

    //TODO verify URL using given method

    // Inserting URL into databse, only if it does not already exist
    url.findOne(
      { url: userInput },
      { url: 1, shortUrl: 1 },
      (err, foundUrl) => {
        if (err) console.log(err);

        if (foundUrl?.url && foundUrl?.shortUrl) {
          res.send({
            original_url: foundUrl["url"],
            short_url: foundUrl["shortUrl"],
          });
        } else {
          //creating and saving new db entry
          let newUrl = new url({
            url: userInput,
            shortUrl: countCreated,
          });
          newUrl.save((err, data) => {
            if (err) console.log(err);
            countCreated += 1;
          });
          // sending new url as result
          res.send({
            orginial_url: newUrl["url"],
            short_url: newUrl["shortUrl"],
          });
        }
      }
    );
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
