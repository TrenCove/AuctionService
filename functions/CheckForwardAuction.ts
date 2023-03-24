import sqlite3 from "sqlite3";
import { itemDbRow } from "../types/interfaces";

const db = new sqlite3.Database("../db/items.db", (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Connected to the items database.");
});
/**
 * Called on every bid and when forward auction ends, keeps track of items and their subscribers with a map
 * 
 * @param item - All possible parameters of the items data base (items database interface)
 * @param pubSubList - A map which contains a number and a string array (A pubsub)
 * @param ws - a websocket for communication
 * 
 * 
 */
export async function CheckForwardAuction(): Promise<itemDbRow[]> {
  //TODO check also if active
  return new Promise((resolve, reject) => {
    const currentTime = new Date().getTime();
    db.all(
      "SELECT * FROM items WHERE auction_type='F' AND active='true' AND end_time<=?",
      [currentTime],
      (error, rows: itemDbRow[]) => {
        if (error) {
          console.log(error);
          return reject("Error occurred");
        }
        console.log("Found %o", rows);
        console.log("Changing items to inactive ");
        rows.forEach((row)=>{
          row.active = false;
        })
        console.log("New items %o", rows);
        return resolve(rows);
      }
    );
  });
}
