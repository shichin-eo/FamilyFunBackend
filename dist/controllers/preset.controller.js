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
exports.createPreset = exports.getPresets = void 0;
require("dotenv").config();
const database_1 = require("../database");
const PORT = process.env.PORT || 3001;
exports.getPresets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query("SELECT * FROM presets LEFT JOIN preset_images ON presets.preset_img_id = preset_images.id");
        const result = yield response.rows.map((row) => (Object.assign(Object.assign({}, row), { url: `http://localhost:${PORT}/static/preset_images/${row["preset_image_filename"]}.${row["preset_image_extension"]}` })));
        console.log(result);
        return res.status(200).json(result);
    }
    catch (e) {
        return res
            .status(500)
            .json(`There is something wrong with getting presets`);
    }
});
exports.createPreset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preset_type, preset_value, preset_lang } = req.body;
        yield database_1.pool.query("INSERT INTO presets (preset_type, preset_value, preset_lang) VALUES ($1, $2, $3)", [preset_type, preset_value, preset_lang]);
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
    }
    catch (e) {
        return res.status(500).json("Something is wrong with creating preset...");
    }
});
