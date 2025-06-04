"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuariosController_1 = __importDefault(require("../controllers/usuariosController"));
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/logout', (req, res) => {
    res.render('logout');
});
router.get('/', usuariosController_1.default.getAllUsuarios);
router.post('/', usuariosController_1.default.createUsuario);
router.post('/login', usuariosController_1.default.loginUsuario);
router.post('/logout', usuariosController_1.default.logoutUsuario);
router.post('/register', usuariosController_1.default.registerUsuario);
router.route('/:id')
    .delete(usuariosController_1.default.deleteUsuario);
router.post('/auth/register', usuariosController_1.default.authRegisterUsuario);
router.post('/auth/login', usuariosController_1.default.authLoginUsuario);
router.get('/auth/me', authentication_1.authenticateJWT, usuariosController_1.default.authMeUsuario);
router.get('/users/me', authentication_1.authenticateJWT, usuariosController_1.default.getMeUsuario);
router.put('/users/me', authentication_1.authenticateJWT, usuariosController_1.default.updateMeUsuario);
router.delete('/users/me', authentication_1.authenticateJWT, usuariosController_1.default.deleteMeUsuario);
router.get('/admin/users', authentication_1.authenticateJWT, usuariosController_1.default.getAllUsuariosAdmin);
router.get('/admin/users/:id', authentication_1.authenticateJWT, usuariosController_1.default.getUsuarioAdmin);
router.put('/admin/users/:id', authentication_1.authenticateJWT, usuariosController_1.default.updateUsuarioAdmin);
router.delete('/admin/users/:id', authentication_1.authenticateJWT, usuariosController_1.default.deleteUsuarioAdmin);
exports.default = router;
