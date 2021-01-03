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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
//!! GET USERS !!//
exports.getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query("SELECT * FROM users");
        return res.status(200).json(response.rows);
    }
    catch (e) {
        return res.status(500).json("Something is wrong with getting users...");
    }
    //?? return res.send(req.user); //?? ИСПОЛЬЗОВАТЬ ДЛЯ ДАЛЬНЕЙШЕГО ИЗВЛЕЧЕНИЯ ДАННЫХ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
});
//!! GET USER BY ID !!//
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        console.log(req.params.id);
        const response = yield database_1.pool.query("SELECT * FROM users WHERE id=$1", [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        return res.status(500).json("Something is wrong with getting user...");
    }
});
//!! CREATE USER !!//
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { family_id, user_name, user_surname, user_patronymic, user_password, user_email, user_birthdate, user_role, user_sex, } = req.body;
        //!const response: QueryResult =  УБРАНО
        yield database_1.pool.query("INSERT INTO users (family_id, user_name, user_surname, user_patronymic, user_password, user_email, user_birthdate, user_role, user_sex) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
            family_id,
            user_name,
            user_surname,
            user_patronymic,
            user_password,
            user_email,
            user_birthdate,
            user_role,
            user_sex,
        ]);
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
    }
    catch (e) {
        return res.status(500).json("Something is wrong with creating user...");
    }
});
//!! UPDATE USER !!//
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { family_id, user_name, user_surname, user_patronymic, user_password, user_email, user_birthdate, user_role, user_sex, } = req.body;
        yield database_1.pool.query("UPDATE users SET family_id = $1, user_name = $2, user_surname = $3, user_patronymic = $4, user_password = $5, user_email = $6, user_birthdate = $7, user_role = $8, user_sex = $9 WHERE id = $10", [
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
        ]);
        return res.status(200).json(`User ${id} has been updated Successfully`);
    }
    catch (e) {
        return res.status(500).json("Something is wrong with updating user...");
    }
});
//!! DELETE USER !!//
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield database_1.pool.query("DELETE FROM users WHERE id = $1", [id]);
        return res.status(200).json(`User ${id} deleted Successfully`);
    }
    catch (e) {
        return res.status(500).json("Something is wrong with deleting user...");
    }
});
