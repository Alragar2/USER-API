import express from 'express';
import usuariosController from '../controllers/usuariosController';
import { authenticateJWT } from '../middlewares/authentication';
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    res.render('logout');   
});

router.get('/', usuariosController.getAllUsuarios);
router.post('/', usuariosController.createUsuario);
router.post('/login', usuariosController.loginUsuario);
router.post('/logout', usuariosController.logoutUsuario);
router.post('/register', usuariosController.registerUsuario);

router.route('/:id')
    .delete(usuariosController.deleteUsuario);

router.post('/auth/register', usuariosController.authRegisterUsuario);
router.post('/auth/login', usuariosController.authLoginUsuario);
router.get('/auth/me', authenticateJWT, usuariosController.authMeUsuario);
 
router.get('/users/me', authenticateJWT, usuariosController.getMeUsuario);
router.put('/users/me', authenticateJWT, usuariosController.updateMeUsuario);
router.delete('/users/me', authenticateJWT, usuariosController.deleteMeUsuario);

router.get('/admin/users', authenticateJWT, usuariosController.getAllUsuariosAdmin);
router.get('/admin/users/:id', authenticateJWT, usuariosController.getUsuarioAdmin);
router.put('/admin/users/:id', authenticateJWT, usuariosController.updateUsuarioAdmin);
router.delete('/admin/users/:id', authenticateJWT, usuariosController.deleteUsuarioAdmin);

export default router;