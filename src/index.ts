import 'dotenv/config';
import app from './app';
import { AppDataSource } from './db/conexion';

async function main() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
        app.listen(6565, () => {
            console.log('Server is running on port 6565');
        });
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}
main();
