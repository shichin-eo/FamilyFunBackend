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
exports.login = exports.register = void 0;
require("dotenv").config();
const database_1 = require("../database");
//? validation
const validation_1 = require("../validation/validation");
//? bcrypt
const bcrypt = __importStar(require("bcryptjs"));
//? JWT
const jwt = __importStar(require("jsonwebtoken"));
//*------------------------------------------------------
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, user_surname, user_password, user_email, user_birthdate, user_sex, } = req.body;
    //! validation
    const { error } = validation_1.registerValidation(req.body);
    if (error) {
        return res.status(400).send(error === null || error === void 0 ? void 0 : error.details[0].message);
    }
    //! checking if the user already exists
    const emailExist = yield database_1.pool.query("SELECT * from users WHERE user_email=$1", [user_email]);
    if (emailExist.rowCount) {
        return res.status(400).send("EMAIL ALREADY EXISTS");
    }
    //! Hash password
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(user_password, salt);
    //! Create a new user
    try {
        yield database_1.pool.query("INSERT INTO users (user_name, user_surname, user_password, user_email, user_birthdate, user_sex) VALUES ($1, $2, $3, $4, $5, $6)", [
            user_name,
            user_surname,
            hashedPassword,
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
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, user_surname, user_password, user_email, user_birthdate, user_sex, } = req.body;
    //! validation
    const { error } = validation_1.loginValidation(req.body);
    if (error) {
        return res.status(400).send(error === null || error === void 0 ? void 0 : error.details[0].message);
    }
    //! checking if the email already exists
    const user = yield database_1.pool.query("SELECT * from users WHERE user_email=$1", [user_email]);
    if (!user.rowCount) {
        return res.status(400).send("Email or password is wrong");
    }
    //! Password is correct
    console.log(user_password);
    console.log(user.rows[0]["user_password"]);
    const validPass = yield bcrypt.compare(user_password, user.rows[0]["user_password"]);
    if (!validPass) {
        return res.status(400).send("Invalid password");
    }
    //!!! Create and assign a token
    const secretKey = process.env.TOKEN_SECRET;
    if (secretKey === undefined) {
        return res.status(400).send("TOKEN IS UNDEFINED");
    }
    console.log(secretKey);
    const token = jwt.sign({
        _id: user.rows[0]["id"],
    }, secretKey);
    //return res.header("auth-token", token).send({"status" : "OK"}); //? better
    //return res.send({ "auth-token": token }); //?
    return res.header("auth-token", token).send(token);
});
