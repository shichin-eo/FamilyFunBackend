"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
//*------------------------------------------------------
//!--- Register Validation
exports.registerValidation = (data) => {
    const schema = joi_1.default.object({
        user_name: joi_1.default.string().required(),
        user_surname: joi_1.default.string().required(),
        user_email: joi_1.default.string().min(6).required().email(),
        user_password: joi_1.default.string().min(8).required(),
        user_birthdate: joi_1.default.date(),
        user_sex: joi_1.default.string(),
    });
    return schema.validate(data);
};
//!--- Login Validation
exports.loginValidation = (data) => {
    const schema = joi_1.default.object({
        // user_name: Joi.string().required(),
        // user_surname: Joi.string().required(),
        user_email: joi_1.default.string().min(6).required().email(),
        user_password: joi_1.default.string().min(8).required(),
    });
    return schema.validate(data);
};
