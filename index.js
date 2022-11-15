import express from "express";
import fs from 'fs'

import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors'

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect("mongodb+srv://KolesN:Asdfghjkl1@cluster0.z8bpk8z.mongodb.net/blog-db?retryWrites=true&w=majority")
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log("Error:", err);
  });

const app = express();

const port = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors())

app.get("/", (req, res) => {
  console.log("aaaaaaaaaaaaaaaa");
  res.send({ status: "OK" });
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(port, console.log(`On port ${port}`));
