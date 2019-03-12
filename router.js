const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "BeerDB";
const Grid = require("gridfs-stream");

const router = app => {
  /*
  findRecipeByName
  - Case-insensitive search to name value of Recipes collection
  =========================
  Parameters:
  name (Required): term to search for in name field of Recipes collection
  rpp (Default: 5): Results per page
  page (Default: 1): Page of results - 1 indexed
  */
  app.get("/findRecipeByName", (req, res) => {
    // Check if name parameter is given
    if (!req.query.name) {
      return res.status(400).json({ error: "name parameter is required" });
    }

    // Local variables from parameters
    const { name } = req.query;
    const rpp = req.query.rpp || 5;
    const page = req.query.page || 1;

    // Create regex pattern for case-insensitive search of parameter
    const regexPattern = new RegExp(`^${name}$`, "i");

    // Connect to database
    MongoClient.connect(dbURL, (err, database) => {
      if (err) throw err;
      // Get database object
      const dbObject = database.db(dbName);

      // Search recipes collections
      dbObject
        .collection("Recipes")
        .find({ Name: { $regex: regexPattern } }, {})
        .skip(rpp * page - 1)
        .limit(rpp)
        .toArray((err2, result) => {
          if (err2) throw err2;

          res.status(200).send(result);
        });
    });
  });

  app.get("/image", (req, res) => {
    // Connect to database
    MongoClient.connect(dbURL, (err, database) => {
      if (err) throw err;
      // Get database object
      const dbObject = database.db(dbName);

      const gfs = Grid(dbObject, mongo);
      const readStream = gfs.createReadStream({
        filename: "10.jpg"
      });
      readStream.pipe(res);
    });
  });
};

module.exports = router;
