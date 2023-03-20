import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import {authenticateToken} from './middleware/authenticateToken';
import * as cron from 'node-cron';
import { CheckAuction } from "./CheckAuction";

const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 3001;

const pubSubList = new Map<string, string[]>(); //mapping itemID to usernames
const userSockets = new Map<string, string>(); //mapping username to socket to send notif out


app.post('/publish', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

app.post('/subscribe', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

app.post('/unsubscribe', authenticateToken, (req: Request, res: Response)=>{
    //todo
});

cron.schedule('* * * * *', async () => {
    console.log("Running auction check");
    const dueItems = await CheckAuction();
    if(dueItems.length > 0){
        dueItems.forEach((item)=>{
            publish(item);
        })
    }
});

function publish(itemID: string){
    const users = pubSubList.get(itemID);
    if(users && users.length > 0){
        //TODO: send the users connected via websocket
    }
};

function subscribe(username: string, itemID: string){
    const currentWatchingUsers = pubSubList.get(itemID);
    if(currentWatchingUsers != undefined){
        currentWatchingUsers.push(username);
        pubSubList.set(itemID, currentWatchingUsers);
    }else{
        pubSubList.set(itemID, [username]);
    }
}
