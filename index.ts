import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import * as cron from "node-cron";
import { CheckForwardAuction } from "./functions/CheckForwardAuction";
import { publish } from "./functions/Publish";
import { subscribe } from "./functions/Subscribe";
import { unsubscribe } from "./functions/Unsubscribe";
import cors from "cors";
import ws from "ws";
import { itemDbRow, websockData } from "./types/interfaces";
import { CheckDutchAuction } from "./functions/CheckDutchAuction";
import { updateItem } from "./functions/UpdateItem";

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 3003;

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (socket) => {
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

app.post("/publish", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const item = req.body.data.item as itemDbRow;
    console.log("received to publish: " + item);
    await publish(item, pubSubList, wsServer);
    if(item.active == false && item.auction_type == 'D'){
      unsubscribe(item.top_bidder, item.item_id, pubSubList);
    }
    if(item.auction_type == 'F' && item.active == false){
      unsubscribe(item.top_bidder, item.item_id, pubSubList);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

cron.schedule("* * * * *", async () => {
  console.log("Running auction check");
  const endingItems = await CheckForwardAuction();
  const reducedItems = await CheckDutchAuction();
  if (endingItems.length > 0) {
    endingItems.forEach(async (item) => {
      console.log("Ending auction for: " + item.item_id);
      await updateItem(item);
      await publish(item, pubSubList, wsServer);
    });
  }
  if (reducedItems.length > 0) {
    reducedItems.forEach(async (item) => {
      console.log("Reducing prices for: " + item.item_id);
      await updateItem(item);
      await publish(item, pubSubList, wsServer);
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
