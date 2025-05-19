import express, {Request, Response} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usuarios from './routes/usuariosRoutes';
import cookieParser from "cookie-parser";

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use("/usuarios", usuarios);

export default app;