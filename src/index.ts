//*-------- imports -----------------------*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
import indexRoutes from "./routes/index";

//* --------------------------------------- */
const app = express();
const PORT = process.env.PORT || 3001;

//* middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//!new
// const img1path = "/public/category_bell.png";
// app.get("/public", (req, res) => {
//   res.sendFile(__dirname + img1path);
// });
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api/v1", indexRoutes);

app.listen(PORT, () => {
  console.log(`server has been started on ${PORT}`);
});
