import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import * as cron from "node-cron";
import { CheckAuction } from "./functions/CheckAuction";
import { publish } from "./functions/Publish";
import { subscribe } from "./functions/Subscribe";
import { unsubscribe } from "./functions/Unsubscribe";
import cors from 'cors';
import ws from "ws";
import { itemDbRow, websockData } from "./types/interfaces";

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 3001;

const wsServer = new ws.Server({ noServer: true });
var globalSocket: ws.WebSocket;

wsServer.on("connection", (socket) => {
  globalSocket = socket;
  socket.on("message", function message(data: string) {
    console.log("Received from websocket: %s", data);
    const parsedData = JSON.parse(data) as websockData;
    switch (parsedData.action) {
      case "subscribe":
        console.log(
          "subscribing " + parsedData.username + " to " + parsedData.item
        );
        subscribe(parsedData.username, parsedData.item, pubSubList);
        break;
      case "unsubscribe":
        console.log(
          "unsubscribing " + parsedData.username + " from " + parsedData.item
        );
        unsubscribe(parsedData.username, parsedData.item, pubSubList);
        break;
    }
  });
});

const pubSubList = new Map<number, string[]>(); //mapping itemID to usernames

app.post("/publish", authenticateToken, async (req: Request, res: Response) => {
    const item = req.body.item as itemDbRow;
    await publish(item, pubSubList, globalSocket);
    res.sendStatus(200);
});

cron.schedule("* * * * *", async () => {
  console.log("Running auction check");
  const dueItems = await CheckAuction();
  if (dueItems.length > 0) {
    dueItems.forEach(async (item) => {
      console.log("Ending auction for: " + item.item_id);
      await publish(item, pubSubList, globalSocket);
      //TODO: Check if we need to move from active item db to the completed db or after payment
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Auction Service is running at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
