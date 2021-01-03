"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//*-------- imports -----------------------*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const index_1 = __importDefault(require("./routes/index"));
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
app.use("/api/v1", index_1.default);
app.listen(PORT, () => {
    console.log(`server has been started on ${PORT}`);
});
