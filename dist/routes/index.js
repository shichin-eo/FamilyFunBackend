"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController = __importStar(require("../controllers/users.controller"));
const families_controller_1 = require("../controllers/families.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const preset_controller_1 = require("../controllers/preset.controller");
const cardsController = __importStar(require("../controllers/cards.controller"));
const notificationsController = __importStar(require("../controllers/notifications.controller"));
// * verify middleware
const verifytoken_1 = require("../routes/verifytoken");
const rateLimit = require("express-rate-limit");
const router = express_1.Router();
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100000,
    message: "Too many cards updated from this IP, please try again after 5 minutes",
});
//!! Authentication
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
//!! router_for_table_users !/
router.get("/users", verifytoken_1.verify, usersController.getUsers); //!!!!!!
router.get("/users/:id", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:id", usersController.updateUser);
router.delete("/users/:id", usersController.deleteUser);
//!! router_for_table_users !/
router.get("/api/v1/families", families_controller_1.getFamilies);
//!! router_for_cards !/
router.get("/cards/:userId", cardsController.getPersonalCards);
router.post("/cards", cardsController.createCard);
router.put("/cards/:id", apiLimiter, cardsController.updateCard);
router.delete("/cards/:id", cardsController.deleteCard);
//!! router_for_notifications !/
router.get("/notifications/sender/:senderId", notificationsController.getSenderNotifications);
router.get("/notifications/recipient/:recipientId", notificationsController.getRecipientNotifications);
router.post("/notifications", notificationsController.createNotification);
router.put("/notifications/:id", notificationsController.updateNotification);
router.delete("/notifications/:id", notificationsController.deleteNotification);
//!! router_for_presets !/
router.get("/presets", preset_controller_1.getPresets);
router.post("/presets", preset_controller_1.createPreset);
exports.default = router;
