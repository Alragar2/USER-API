"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const usuariosModels_1 = require("../models/usuariosModels");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Lacasa22032002",
    database: "users",
    logging: true,
    entities: [usuariosModels_1.Usuario],
    synchronize: false,
});
