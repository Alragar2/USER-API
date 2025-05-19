import express from 'express';
import usuariosController from '../controllers/usuariosController';
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

export default router;