import ws from "ws";
import sqlite3 from "sqlite3";
import { itemDbRow, publishData } from "../types/interfaces";

const db = new sqlite3.Database("./db/items.db", (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Connected to the items database.");
});

/**
 * Called on every bid and on auction ends, keeps track of items and their subscribers with a map
 * 
 * @param item - All possible parameters of the items data base (items database interface)
 * @param pubSubList - A map which contains a number and a string array (A pubsub)
 * @param ws - a websocket for communication
 * 
 * 
 */
export async function publish(
  item: itemDbRow,
  pubSubList: Map<number, string[]>,
  ws: ws.WebSocket
) {
  await updateItem(item);
  const users = pubSubList.get(item.item_id);
  console.log("Users to publish to " + users);
  if (users && users.length > 0) {
    console.log("Publishing: " + item.item_id + " to users " + users);
    users.forEach((user) => {
      const websockData: publishData = {
        action: "publish",
        username: user,
        item: item,
      };
      ws.send(JSON.stringify(websockData));
    });
  }
}

/** 
 * Updates items database parameteres which include the activity of it, the top bidders username, and the price
 * 
 * @param item - All possible parameters of the items database (items database interface)
 * 
 * @returns either a success message or error message depending on if the query passed
 */
async function updateItem(item: itemDbRow) {
  console.log("Updating db with new item %o", item);
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE items SET active=?, top_bidder=?, price=? WHERE item_id=?",
      [
        `${item.active}`,
        `${item.top_bidder}`,
        `${item.price}`,
        `${item.item_id}`,
      ],
      (error) => {
        if (error) {
          console.log(error);
          return reject("Error occurred");
        }
        return resolve("Success");
      }
    );
  });
}

//UPDATE items SET active='true' WHERE item_id='2'
