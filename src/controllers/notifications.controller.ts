import { RequestHandler } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";

//! GET request for fetching notifications created BY USER*/
export const getSenderNotifications: RequestHandler = async (req, res) => {
  try {
    const notification_sender = parseInt(req.params.senderId);
    console.log(notification_sender);

    const response: QueryResult = await pool.query(
      "SELECT * FROM notifications WHERE notification_sender_id = $1",
      [notification_sender]
    );
    res.status(200).send(response.rows);
  } catch (e) {
    res
      .status(500)
      .send("Something is wrong with getting sender notifications...");
  }
};

//! GET request for fetching notifications created FOR USER*/
export const getRecipientNotifications: RequestHandler = async (req, res) => {
  try {
    const recipientId = parseInt(req.params.recipientId);
    console.log(recipientId);

    const response: QueryResult = await pool.query(
      "SELECT * FROM notifications WHERE $1 = ANY (notification_recipient_ids)",
      [recipientId]
    );
    res.status(200).send(response.rows);
  } catch (e) {
    res
      .status(500)
      .send("Something is wrong with getting recipient notifications...");
  }
};

//!! CREATE NOTIFICATION **//
export const createNotification: RequestHandler = async (req, res) => {
  try {
    console.log(req.body);
    const {
      notification_sender_id,
      notification_recipient_ids,
      notification_date,
      notification_title,
      notification_body,
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO notifications (notification_sender_id, notification_recipient_ids, notification_date, notification_title, notification_body) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        notification_sender_id,
        notification_recipient_ids,
        notification_date,
        notification_title,
        notification_body,
      ]
    );
    res.status(201).json({
      message: "Notification created Successfully",
      body: {
        notification: {
          id: response.rows[0]["id"],
          notification_sender_id,
          notification_recipient_ids,
          notification_date,
          notification_title,
          notification_body,
        },
      },
    });
  } catch (e) {
    res.status(500).json("Something is wrong with creating notification...");
  }
};
//!! UPDATE NOTIFICATION !!//
export const updateNotification: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      notification_recipient_ids,
      notification_date,
      notification_title,
      notification_body,
    } = req.body;
    await pool.query(
      "UPDATE notifications SET notification_recipient_ids = $1, notification_date = $2, notification_title = $3, notification_body = $4 WHERE id = $5",
      [
        notification_recipient_ids,
        notification_date,
        notification_title,
        notification_body,
        id,
      ]
    );
    return res
      .status(200)
      .json(`Notification ${id} has been updated Successfully`);
  } catch (e) {
    return res
      .status(500)
      .json("Something is wrong with updating notification...");
  }
};

//!! DELETE NOTIFICATION !!//
export const deleteNotification: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query("DELETE FROM notifications WHERE id = $1", [id]);
    return res.status(200).json(`Notification ${id} deleted Successfully`);
  } catch (e) {
    return res
      .status(500)
      .json("Something is wrong with deleting notification...");
  }
};
