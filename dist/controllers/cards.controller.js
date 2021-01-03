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
exports.deleteCard = exports.updateCard = exports.createCard = exports.getPersonalCards = void 0;
const database_1 = require("../database");
exports.getPersonalCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const card_user = parseInt(req.params.userId);
        console.log(card_user);
        const response = yield database_1.pool.query("SELECT * from cards WHERE card_user=$1 ORDER BY card_priority", [card_user]);
        res.send(response.rows);
    }
    catch (e) {
        res.status(500).json("Something is wrong with getting cards...");
    }
});
exports.createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { card_user, card_type, card_category, card_description, card_priority, } = req.body;
        if (card_priority <= 6) {
            const amountCards = yield database_1.pool.query("SELECT * from cards WHERE card_user = $1 and card_type = $2 ", [card_user, card_type]);
            if (amountCards.rows.length > 5) {
                res
                    .status(500)
                    .json({ message: "There are already 6 cards of this type, sorry" });
            }
            else {
                const isDublicateCard = amountCards.rows.find((card) => card["card_priority"] === card_priority);
                if (!isDublicateCard) {
                    const response = yield database_1.pool.query("INSERT INTO cards (card_user, card_type, card_category, card_description, card_priority) VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                        card_user,
                        card_type,
                        card_category,
                        card_description,
                        card_priority,
                    ]);
                    res.status(201).json({
                        message: "Card created successfully",
                        body: {
                            card: {
                                id: response.rows[0]["id"],
                                card_user,
                                card_type,
                                card_category,
                                card_description,
                                card_priority,
                            },
                        },
                    });
                }
                else {
                    res.status(500).json({
                        message: "A card with this priority already exists!",
                    });
                }
            }
        }
        else {
            res.status(500).json({
                message: "Error: invalid card_priority",
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Sorry, there is something wrong with creating a card, invalid db request",
        });
    }
});
exports.updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { card_user, card_type, card_category, card_description, card_priority, } = req.body;
        console.log(req.body);
        console.log(id);
        yield database_1.pool.query("UPDATE cards SET card_user = $1, card_type = $2, card_category = $3, card_description = $4, card_priority = $5 WHERE id = $6", [card_user, card_type, card_category, card_description, card_priority, id]);
        res.status(200).json({
            message: `Card ${id} has been changed successfully`,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Something is wrong with patching card...",
        });
    }
});
exports.deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield database_1.pool.query("DELETE FROM cards WHERE id = $1", [id]);
        res.status(200).json({
            message: `Card ${id} deleted successfully`,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Something is wrong with deleting card...",
        });
    }
});
