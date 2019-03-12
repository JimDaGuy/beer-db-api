const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
const router = require("./router.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router(app);

app.listen(port, err => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}`);
});
