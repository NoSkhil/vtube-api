import express,{Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import session from "express-session";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    }
}));

app.get('/', (req:Request,res:Response)=> res.status(200).send({data:"voxtone server."}));
app.use('/api/user',userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, async ()=>{
console.log(`Voxtone server running at port - ${PORT}`);
});