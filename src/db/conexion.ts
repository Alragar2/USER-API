import { DataSource } from 'typeorm';
import { Usuario } from '../models/usuariosModels';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Lacasa22032002",
    database: "users",
    logging: true,
    entities: [Usuario],
    synchronize: false,
});
