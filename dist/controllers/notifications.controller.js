"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getRecipientNotifications = exports.getSenderNotifications = void 0;
const database_1 = require("../database");
//! GET request for fetching notifications created BY USER*/
exports.getSenderNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification_sender = parseInt(req.params.senderId);
        console.log(notification_sender);
        const response = yield database_1.pool.query("SELECT * FROM notifications WHERE notification_sender_id = $1", [notification_sender]);
        res.status(200).send(response.rows);
    }
    catch (e) {
        res
            .status(500)
            .send("Something is wrong with getting sender notifications...");
    }
});
//! GET request for fetching notifications created FOR USER*/
exports.getRecipientNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipientId = parseInt(req.params.recipientId);
        console.log(recipientId);
        const response = yield database_1.pool.query("SELECT * FROM notifications WHERE $1 = ANY (notification_recipient_ids)", [recipientId]);
        res.status(200).send(response.rows);
    }
    catch (e) {
        res
            .status(500)
            .send("Something is wrong with getting recipient notifications...");
    }
});
//!! CREATE NOTIFICATION **//
exports.createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { notification_sender_id, notification_recipient_ids, notification_date, notification_title, notification_body, } = req.body;
        const response = yield database_1.pool.query("INSERT INTO notifications (notification_sender_id, notification_recipient_ids, notification_date, notification_title, notification_body) VALUES ($1, $2, $3, $4, $5) RETURNING id", [
            notification_sender_id,
            notification_recipient_ids,
            notification_date,
            notification_title,
            notification_body,
        ]);
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
    }
    catch (e) {
        res.status(500).json("Something is wrong with creating notification...");
    }
});
//!! UPDATE NOTIFICATION !!//
exports.updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { notification_recipient_ids, notification_date, notification_title, notification_body, } = req.body;
        yield database_1.pool.query("UPDATE notifications SET notification_recipient_ids = $1, notification_date = $2, notification_title = $3, notification_body = $4 WHERE id = $5", [
            notification_recipient_ids,
            notification_date,
            notification_title,
            notification_body,
            id,
        ]);
        return res
            .status(200)
            .json(`Notification ${id} has been updated Successfully`);
    }
    catch (e) {
        return res
            .status(500)
            .json("Something is wrong with updating notification...");
    }
});
//!! DELETE NOTIFICATION !!//
exports.deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield database_1.pool.query("DELETE FROM notifications WHERE id = $1", [id]);
        return res.status(200).json(`Notification ${id} deleted Successfully`);
    }
    catch (e) {
        return res
            .status(500)
            .json("Something is wrong with deleting notification...");
    }
});
