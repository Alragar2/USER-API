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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const conexion_1 = require("./db/conexion");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield conexion_1.AppDataSource.initialize();
            console.log('Database connected successfully');
            app_1.default.listen(6565, () => {
                console.log('Server is running on port 6565');
            });
        }
        catch (error) {
            console.error('Error connecting to the database', error);
        }
    });
}
main();
