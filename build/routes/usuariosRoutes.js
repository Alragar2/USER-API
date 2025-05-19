"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuariosController_1 = __importDefault(require("../controllers/usuariosController"));
const router = express_1.default.Router();
router.get('/', usuariosController_1.default.getAllUsuarios);
router.post('/', usuariosController_1.default.createUsuario);
router.post('/login', usuariosController_1.default.loginUsuario);
router.post('/logout', usuariosController_1.default.logoutUsuario);
router.post('/register', usuariosController_1.default.registerUsuario);
router.route('/:id')
    .delete(usuariosController_1.default.deleteUsuario);
exports.default = router;
