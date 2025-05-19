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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuariosModels_1 = require("../models/usuariosModels");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuariosController {
    constructor() {
    }
    getAllUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield usuariosModels_1.Usuario.find();
                res.status(200).json(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    loginUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ message: "Login endpoint" });
        });
    }
    registerUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { email, password } = _a, rest = __rest(_a, ["email", "password"]);
            try {
                const existingUsuario = yield usuariosModels_1.Usuario.findOne({ where: { email } });
                if (existingUsuario) {
                    return res.status(400).json({ message: "El usuario ya existe" });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const nuevoUsuario = usuariosModels_1.Usuario.create(Object.assign({ email, password: hashedPassword }, rest));
                const savedUsuario = yield usuariosModels_1.Usuario.save(nuevoUsuario);
                res.status(201).json(savedUsuario);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    createUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const usuario = usuariosModels_1.Usuario.create(Object.assign(Object.assign({}, rest), { password: hashedPassword }));
                const create = yield usuariosModels_1.Usuario.save(usuario);
                res.status(201).json(create);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    logoutUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ message: "Logout exitoso" });
        });
    }
    deleteUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deleteUsuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(id) } });
                if (!deleteUsuario) {
                    throw new Error("Usuario no encontrado");
                }
                yield usuariosModels_1.Usuario.delete({ id: Number(id) });
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
}
exports.default = new UsuariosController();
