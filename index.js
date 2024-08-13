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

let existingUrl = {};

const setExistingUrl = (original_Url, short_Url) => {
  existingUrl = { url: original_Url, shortUrl: short_Url };
};

app
  .route("/api/shorturl")
  .get((req, res, next) => {
    res.send("Get request");
    // respond with redirect to long url search by id
    next();
  })
  .post((req, res) => {
    // To return
    let result = {};

    //TODO verify URL using given method

    // Inserting URL into databse, only if it does not already exist
    //get user input from req body
    let userInput = req.body.url;
    // search to see if it already exists in the database
    let doc = url.findOne(
      { url: userInput },
      { url: 1, shortUrl: 1 },
      (err, foundUrl) => {
        if (err) console.log(err);
        if (foundUrl) {
          // need to set result and send in here
          console.log(`${foundUrl["url"]} exists`);
          setExistingUrl(foundUrl["url"], foundUrl["shortUrl"]);
        }
      }
    );
    console.log(existingUrl);

    // if it does, choose the existing short url instead of creating a new one.
    if (existingUrl) {
      result = {
        orginial_url: "omg",
        short_url: "like I cannot",
      };
      console.log(result);
    } else {
      let newUrl = new url({
        url: userInput,
        shortUrl: countCreated,
      });
      newUrl.save((err, data) => {
        if (err) console.log(err);
        countCreated += 1;
      });
      result = { orginial_url: newUrl["url"], short_url: newUrl["shortUrl"] };
    }

    res.send(result);
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
