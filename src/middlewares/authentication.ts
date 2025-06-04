import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
    console.log("Entrando al middleware authenticateJWT");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        console.log("Token decodificado:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido" });
    }
}