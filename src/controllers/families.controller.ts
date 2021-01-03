import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";

//!! GET FAMILIES !!/
export const getFamilies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * from families");
    return res.status(200).json(response.rows);
  } catch (e) {
    return res.status(500).json("Something is wrong with getting families...");
  }
};
