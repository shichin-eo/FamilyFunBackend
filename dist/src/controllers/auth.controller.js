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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const database_1 = require("../database");
//!VALIDATION
const joi_1 = __importDefault(require("@hapi/joi"));
//*------------------------------------------------------
const schema = joi_1.default.object({
    user_name: joi_1.default.string().required(),
    user_surname: joi_1.default.string().required(),
    user_email: joi_1.default.string().min(6).required().email(),
    user_password: joi_1.default.string().min(8).required(),
    user_birthdate: joi_1.default.date(),
    user_sex: joi_1.default.string(),
});
exports.auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //! validation
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error === null || error === void 0 ? void 0 : error.details[0].message);
    }
    //! validation end
    try {
        const { user_name, user_surname, user_password, user_email, user_birthdate, user_sex, } = req.body;
        const response = yield database_1.pool.query("INSERT INTO users (user_name, user_surname, user_password, user_email, user_birthdate, user_sex) VALUES ($1, $2, $3, $4, $5, $6)", [
            user_name,
            user_surname,
            user_password,
            user_email,
            user_birthdate,
            user_sex,
        ]);
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
    }
    catch (err) {
        return res.status(400).send(err);
    }
});
