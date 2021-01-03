require("dotenv").config();
import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";

const PORT = process.env.PORT || 3001;

export const getPresets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query(
      "SELECT * FROM presets LEFT JOIN preset_images ON presets.preset_img_id = preset_images.id"
    );
    const result = await response.rows.map((row) => ({
      ...row,
      url: `http://localhost:${PORT}/static/preset_images/${row["preset_image_filename"]}.${row["preset_image_extension"]}`,
    }));
    console.log(result);
    return res.status(200).json(result);
  } catch (e) {
    return res
      .status(500)
      .json(`There is something wrong with getting presets`);
  }
};

export const createPreset = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { preset_type, preset_value, preset_lang } = req.body;
    await pool.query(
      "INSERT INTO presets (preset_type, preset_value, preset_lang) VALUES ($1, $2, $3)",
      [preset_type, preset_value, preset_lang]
    );
    return res.status(201).json({
      message: "Preset created Successfully",
      body: {
        preset: {
          preset_type,
          preset_value,
          preset_lang,
        },
      },
    });
  } catch (e) {
    return res.status(500).json("Something is wrong with creating preset...");
  }
};
