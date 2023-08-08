const express = require("express");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("public/images/"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const uri = "mongodb+srv://admin:admin@cluster0.sfis6s3.mongodb.net";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

connectToMongoDB();

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Received an image upload request");

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("File uploaded:", req.file);

  const filePath = req.file.path; // Assuming Multer saves the file to the "public/images" directory

  // Save the filePath to the MongoDB database or perform any other desired actions
  // For example:
  const dbo = client.db("fileuploaddb");
  dbo.collection("files").insertOne({ filePath }, (err, result) => {
    if (err) {
      console.error("Error inserting data to MongoDB:", err);
      return res
        .status(500)
        .json({ message: "Error inserting data to MongoDB" });
    }
    console.log("File data inserted into MongoDB:", result.ops);
    return res.status(200).json({ message: "File uploaded successfully" });
  });
});

// in server we will create the route
// here from db here will fetch the image using mongodb
//

const PORT = 8080;
app.listen(PORT, console.log(`working on ${PORT}`));
