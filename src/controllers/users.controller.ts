import { Request, Response } from "express";
import { QueryResult } from "pg";

import { pool } from "../database";

//!! GET USERS !!//
export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM users");
    return res.status(200).json(response.rows);
  } catch (e) {
    return res.status(500).json("Something is wrong with getting users...");
  }
  //?? return res.send(req.user); //?? ИСПОЛЬЗОВАТЬ ДЛЯ ДАЛЬНЕЙШЕГО ИЗВЛЕЧЕНИЯ ДАННЫХ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
};
//!! GET USER BY ID !!//
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    console.log(req.params.id);
    const response: QueryResult = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [id]
    );
    return res.status(200).json(response.rows);
  } catch (e) {
    return res.status(500).json("Something is wrong with getting user...");
  }
};
//!! CREATE USER !!//
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log(req.body);

    const {
      family_id,
      user_name,
      user_surname,
      user_patronymic,
      user_password,
      user_email,
      user_birthdate,
      user_role,
      user_sex,
    } = req.body;
    //!const response: QueryResult =  УБРАНО
    await pool.query(
      "INSERT INTO users (family_id, user_name, user_surname, user_patronymic, user_password, user_email, user_birthdate, user_role, user_sex) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        family_id,
        user_name,
        user_surname,
        user_patronymic,
        user_password,
        user_email,
        user_birthdate,
        user_role,
        user_sex,
      ]
    );

    return res.status(201).json({
      message: "User created Successfully",
      body: {
        user: {
          family_id,
          user_name,
          user_surname,
          user_patronymic,
          user_password,
          user_email,
          user_birthdate,
          user_role,
          user_sex,
        },
      },
    });
  } catch (e) {
    return res.status(500).json("Something is wrong with creating user...");
  }
};
//!! UPDATE USER !!//
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const {
      family_id,
      user_name,
      user_surname,
      user_patronymic,
      user_password,
      user_email,
      user_birthdate,
      user_role,
      user_sex,
    } = req.body;
    await pool.query(
      "UPDATE users SET family_id = $1, user_name = $2, user_surname = $3, user_patronymic = $4, user_password = $5, user_email = $6, user_birthdate = $7, user_role = $8, user_sex = $9 WHERE id = $10",
      [
        family_id,
        user_name,
        user_surname,
        user_patronymic,
        user_password,
        user_email,
        user_birthdate,
        user_role,
        user_sex,
        id,
      ]
    );
    return res.status(200).json(`User ${id} has been updated Successfully`);
  } catch (e) {
    return res.status(500).json("Something is wrong with updating user...");
  }
};

//!! DELETE USER !!//
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return res.status(200).json(`User ${id} deleted Successfully`);
  } catch (e) {
    return res.status(500).json("Something is wrong with deleting user...");
  }
};
