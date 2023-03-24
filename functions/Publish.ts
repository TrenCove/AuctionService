import ws from "ws";
import { itemDbRow, publishData } from "../types/interfaces";

/**
 * Publishes an array of items to watchers of said items
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
  ws: ws.Server
) {
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
      ws.clients.forEach((client) => {
        client.send(JSON.stringify(websockData));
      });
    });
  }
}