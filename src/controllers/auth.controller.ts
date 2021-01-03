require("dotenv").config();
import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";
//? validation
import { registerValidation, loginValidation } from "../validation/validation";
//? bcrypt
import * as bcrypt from "bcryptjs";
//? JWT
import * as jwt from "jsonwebtoken";
//*------------------------------------------------------

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    user_name,
    user_surname,
    user_password,
    user_email,
    user_birthdate,
    user_sex,
  } = req.body;
  //! validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error?.details[0].message);
  }
  //! checking if the user already exists
  const emailExist: QueryResult = await pool.query(
    "SELECT * from users WHERE user_email=$1",
    [user_email]
  );
  if (emailExist.rowCount) {
    return res.status(400).send("EMAIL ALREADY EXISTS");
  }
  //! Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user_password, salt);
  //! Create a new user
  try {
    await pool.query(
      "INSERT INTO users (user_name, user_surname, user_password, user_email, user_birthdate, user_sex) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        user_name,
        user_surname,
        hashedPassword,
        user_email,
        user_birthdate,
        user_sex,
      ]
    );
    return res.status(201).json({
      message: "User created Successfully",
      body: {
        user: {
          user_name,
          user_surname,
          user_password,
          user_email,
          user_birthdate,
          user_sex,
        },
      },
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const {
    user_name,
    user_surname,
    user_password,
    user_email,
    user_birthdate,
    user_sex,
  } = req.body;
  //! validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error?.details[0].message);
  }
  //! checking if the email already exists
  const user: QueryResult = await pool.query(
    "SELECT * from users WHERE user_email=$1",
    [user_email]
  );
  if (!user.rowCount) {
    return res.status(400).send("Email or password is wrong");
  }

  //! Password is correct
  console.log(user_password);
  console.log(user.rows[0]["user_password"]);

  const validPass = await bcrypt.compare(
    user_password,
    user.rows[0]["user_password"]
  );
  if (!validPass) {
    return res.status(400).send("Invalid password");
  }

  //!!! Create and assign a token
  const secretKey = process.env.TOKEN_SECRET;
  if (secretKey === undefined) {
    return res.status(400).send("TOKEN IS UNDEFINED");
  }
  console.log(secretKey);

  const token = jwt.sign(
    {
      _id: user.rows[0]["id"],
    },
    secretKey
  );
  //return res.header("auth-token", token).send({"status" : "OK"}); //? better
  //return res.send({ "auth-token": token }); //?
  return res.header("auth-token", token).send(token);
};
