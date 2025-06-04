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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UsuariosController {
    constructor() {
        console.log("UsuariosController instanciado"); // <-- Este log debe aparecer al iniciar el servidor
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
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son requeridos" });
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { email } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                const isMatch = yield bcrypt_1.default.compare(password, usuario.password);
                if (!isMatch) {
                    throw new Error("Contraseña incorrecta");
                }
                const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.JWT_SECRET || "", {
                    expiresIn: "1h"
                });
                const { password: _ } = usuario, publicUser = __rest(usuario, ["password"]);
                res.status(200)
                    .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600000
                })
                    .redirect("/usuarios/logout");
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    registerUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { email, password } = _a, rest = __rest(_a, ["email", "password"]);
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son requeridos" });
            }
            try {
                const existingUsuario = yield usuariosModels_1.Usuario.findOne({ where: { email } });
                if (existingUsuario) {
                    throw new Error("El usuario ya existe");
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const nuevoUsuario = usuariosModels_1.Usuario.create(Object.assign({ email, password: hashedPassword }, rest));
                const savedUsuario = yield usuariosModels_1.Usuario.save(nuevoUsuario);
                res.status(201).redirect("/usuarios/logout");
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
            res.clearCookie("access_token")
                .status(200)
                .redirect("/usuarios/login");
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
    authRegisterUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { email, password } = _a, rest = __rest(_a, ["email", "password"]);
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son requeridos" });
            }
            try {
                const existingUsuario = yield usuariosModels_1.Usuario.findOne({ where: { email } });
                if (existingUsuario) {
                    throw new Error("El usuario ya existe");
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
    authLoginUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log("Datos de login:", req.body);
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son requeridos" });
                return;
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { email } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                const isMatch = yield bcrypt_1.default.compare(password, usuario.password);
                if (!isMatch) {
                    throw new Error("Contraseña incorrectahdfgdfgfdsgd");
                }
                const token = jsonwebtoken_1.default.sign({ id: String(usuario.id) }, process.env.JWT_SECRET || "", {
                    expiresIn: "1h"
                });
                const { password: _ } = usuario, publicUser = __rest(usuario, ["password"]);
                res.status(200)
                    .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600000
                })
                    .json({
                    message: "Login exitoso",
                    token,
                    user: publicUser
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    authMeUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            console.log("DEBUG authMeUsuario req.user:", user); // <-- Añade este log
            // Validación y log para depuración
            if (!(user === null || user === void 0 ? void 0 : user.id) || isNaN(Number(user.id))) {
                res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
                return;
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(user.id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                const { password: _ } = usuario, publicUser = __rest(usuario, ["password"]);
                res.status(200).json(publicUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    getMeUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            if (!(user === null || user === void 0 ? void 0 : user.id) || isNaN(Number(user.id))) {
                res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
                return;
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(user.id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                const { password: _ } = usuario, publicUser = __rest(usuario, ["password"]);
                res.status(200).json(publicUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    updateMeUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
            if (!(user === null || user === void 0 ? void 0 : user.id) || isNaN(Number(user.id))) {
                res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
                return;
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(user.id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                if (password) {
                    rest.password = yield bcrypt_1.default.hash(password, 10);
                }
                yield usuariosModels_1.Usuario.update({ id: Number(user.id) }, rest);
                const updatedUsuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(user.id) } });
                if (!updatedUsuario) {
                    throw new Error("Usuario no encontrado");
                }
                const { password: _ } = updatedUsuario, publicUser = __rest(updatedUsuario, ["password"]);
                res.status(200).json(publicUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    deleteMeUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            if (!(user === null || user === void 0 ? void 0 : user.id) || isNaN(Number(user.id))) {
                res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
                return;
            }
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(user.id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                yield usuariosModels_1.Usuario.delete({ id: Number(user.id) });
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    getAllUsuariosAdmin(req, res) {
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
    getUsuarioAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                const { password: _ } = usuario, publicUser = __rest(usuario, ["password"]);
                res.status(200).json(publicUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    updateUsuarioAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(id) } });
                if (!usuario) {
                    throw new Error("Usuario no encontrado");
                }
                if (password) {
                    rest.password = yield bcrypt_1.default.hash(password, 10);
                }
                yield usuariosModels_1.Usuario.update({ id: Number(id) }, rest);
                const updatedUsuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(id) } });
                if (!updatedUsuario) {
                    throw new Error("Usuario no encontrado");
                }
                const { password: _ } = updatedUsuario, publicUser = __rest(updatedUsuario, ["password"]);
                res.status(200).json(publicUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
            }
        });
    }
    deleteUsuarioAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const usuario = yield usuariosModels_1.Usuario.findOne({ where: { id: Number(id) } });
                if (!usuario) {
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
