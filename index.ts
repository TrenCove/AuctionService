import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import {authenticateToken} from './middleware/authenticateToken';
import * as cron from 'node-cron';

const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 3000;


app.post('/publish', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

app.post('/subscribe', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

app.post('/unsubscribe', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

cron.schedule('* * * * *', () => {
    //todo
    console.log("Running auction check");
})
