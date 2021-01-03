import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { getFamilies } from "../controllers/families.controller";
import { register, login } from "../controllers/auth.controller";
import { getPresets, createPreset } from "../controllers/preset.controller";
import * as cardsController from "../controllers/cards.controller";
import * as notificationsController from "../controllers/notifications.controller";
// * verify middleware
import { verify } from "../routes/verifytoken";

const rateLimit = require("express-rate-limit");

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins window
  max: 100000, // start blocking after 20 requests
  message:
    "Too many cards updated from this IP, please try again after 5 minutes",
});
//!! Authentication
router.post("/register", register);
router.post("/login", login);

//!! router_for_table_users !/
router.get("/users", verify, usersController.getUsers); //!!!!!!
router.get("/users/:id", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:id", usersController.updateUser);
router.delete("/users/:id", usersController.deleteUser);

//!! router_for_table_users !/
router.get("/api/v1/families", getFamilies);

//!! router_for_cards !/
router.get("/cards/:userId", cardsController.getPersonalCards);
router.post("/cards", cardsController.createCard);
router.put("/cards/:id", apiLimiter, cardsController.updateCard);
router.delete("/cards/:id", cardsController.deleteCard);

//!! router_for_notifications !/
router.get(
  "/notifications/sender/:senderId",
  notificationsController.getSenderNotifications
);
router.get(
  "/notifications/recipient/:recipientId",
  notificationsController.getRecipientNotifications
);

router.post("/notifications", notificationsController.createNotification);
router.put("/notifications/:id", notificationsController.updateNotification);
router.delete("/notifications/:id", notificationsController.deleteNotification);

//!! router_for_presets !/
router.get("/presets", getPresets);
router.post("/presets", createPreset);

export default router;
