const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors")

require("dotenv").config();

const app = express();
const PORT = 8000;

const CLIENT_URL = process.env.CLIENT_URL || "https://your-app.vercel.app";

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

app.use(bodyParser.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
