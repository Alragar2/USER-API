import { Request, Response } from "express";
import { Usuario } from "../models/usuariosModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middlewares/authentication";


class UsuariosController {

    constructor() {
        console.log("UsuariosController instanciado"); // <-- Este log debe aparecer al iniciar el servidor
    }

    async getAllUsuarios(req: Request, res: Response) {
        try {
            const data = await Usuario.find();
            res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }

        }
    }

    async loginUsuario(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email y contraseña son requeridos" });
        }
        try {
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) {
                throw new Error("Contraseña incorrecta");
            }
            const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "", {
                expiresIn: "1h"
            });
            const { password: _, ...publicUser } = usuario;

            res.status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600000
                })
                .redirect("/usuarios/logout");
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async registerUsuario(req: Request, res: Response) {
        const { email, password, ...rest } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email y contraseña son requeridos" });
        }
        try {

            const existingUsuario = await Usuario.findOne({ where: { email } });
            if (existingUsuario) {
                throw new Error("El usuario ya existe");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const nuevoUsuario = Usuario.create({
                email,
                password: hashedPassword,
                ...rest
            });
            const savedUsuario = await Usuario.save(nuevoUsuario);
            res.status(201).redirect("/usuarios/logout");
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async createUsuario(req: Request, res: Response) {
        try {
            const { password, ...rest } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const usuario = Usuario.create({
                ...rest,
                password: hashedPassword
            });
            const create = await Usuario.save(usuario);
            res.status(201).json(create);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async logoutUsuario(req: Request, res: Response) {
        res.clearCookie("access_token")
            .status(200)
            .redirect("/usuarios/login");
    }

    async deleteUsuario(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deleteUsuario = await Usuario.findOne({ where: { id: Number(id) } });
            if (!deleteUsuario) {
                throw new Error("Usuario no encontrado");
            }
            await Usuario.delete({ id: Number(id) });
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }



    async authRegisterUsuario(req: Request, res: Response) {
        const { email, password, ...rest } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email y contraseña son requeridos" });
        }
        try {

            const existingUsuario = await Usuario.findOne({ where: { email } });
            if (existingUsuario) {
                throw new Error("El usuario ya existe");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const nuevoUsuario = Usuario.create({
                email,
                password: hashedPassword,
                ...rest
            });
            const savedUsuario = await Usuario.save(nuevoUsuario);
            res.status(201).json(savedUsuario);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async authLoginUsuario(req: Request, res: Response) {
        const { email, password } = req.body;

        console.log("Datos de login:", req.body);
        
        if (!email || !password) {
            res.status(400).json({ message: "Email y contraseña son requeridos" });
            return;
        }

        try {
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) {
                throw new Error("Contraseña incorrectahdfgdfgfdsgd");
            }

            const token = jwt.sign({ id: String(usuario.id) }, process.env.JWT_SECRET || "", {
                expiresIn: "1h"
            });

            const { password: _, ...publicUser } = usuario;

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
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async authMeUsuario(req: Request, res: Response) {
        const { user } = req as any;
        console.log("DEBUG authMeUsuario req.user:", user); // <-- Añade este log
        // Validación y log para depuración
        if (!user?.id || isNaN(Number(user.id))) {
            res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
            return;
        }
        try {
            const usuario = await Usuario.findOne({ where: { id: Number(user.id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            const { password: _, ...publicUser } = usuario;
            res.status(200).json(publicUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async getMeUsuario(req: Request, res: Response) {
        const { user } = req as any;
        if (!user?.id || isNaN(Number(user.id))) {
            res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
            return;
        }
        try {
            const usuario = await Usuario.findOne({ where: { id: Number(user.id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            const { password: _, ...publicUser } = usuario;
            res.status(200).json(publicUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async updateMeUsuario(req: Request, res: Response) {
        const { user } = req as any;
        const { password, ...rest } = req.body;

        if (!user?.id || isNaN(Number(user.id))) {
            res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
            return;
        }

        try {
            const usuario = await Usuario.findOne({ where: { id: Number(user.id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            if (password) {
                rest.password = await bcrypt.hash(password, 10);
            }

            await Usuario.update({ id: Number(user.id) }, rest);
            const updatedUsuario = await Usuario.findOne({ where: { id: Number(user.id) } });
            if (!updatedUsuario) {
                throw new Error("Usuario no encontrado");
            }
            const { password: _, ...publicUser } = updatedUsuario;
            res.status(200).json(publicUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async deleteMeUsuario(req: Request, res: Response) {
        const { user } = req as any;
        if (!user?.id || isNaN(Number(user.id))) {
            res.status(401).json({ message: "Usuario no autenticado o ID inválido" });
            return;
        }
        try {
            const usuario = await Usuario.findOne({ where: { id: Number(user.id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            await Usuario.delete({ id: Number(user.id) });
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async getAllUsuariosAdmin(req: Request, res: Response) {
        try {
            const data = await Usuario.find();
            res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async getUsuarioAdmin(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findOne({ where: { id: Number(id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            const { password: _, ...publicUser } = usuario;
            res.status(200).json(publicUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async updateUsuarioAdmin(req: Request, res: Response) {
        const { id } = req.params;
        const { password, ...rest } = req.body;

        try {
            const usuario = await Usuario.findOne({ where: { id: Number(id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            if (password) {
                rest.password = await bcrypt.hash(password, 10);
            }

            await Usuario.update({ id: Number(id) }, rest);
            const updatedUsuario = await Usuario.findOne({ where: { id: Number(id) } });
            if (!updatedUsuario) {
                throw new Error("Usuario no encontrado");
            }
            const { password: _, ...publicUser } = updatedUsuario;
            res.status(200).json(publicUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            }
        }
    }

    async deleteUsuarioAdmin(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findOne({ where: { id: Number(id) } });
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
            await Usuario.delete({ id: Number(id) });
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

}

export default new UsuariosController();