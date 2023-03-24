import sqlite3 from "sqlite3";
import { itemDbRow } from "../types/interfaces";

const db = new sqlite3.Database("../db/items.db", (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Connected to the items database.");
});
/**
 * Called on every bid and when dutch auction ends, keeps track of items and their subscribers with a map
 * 
 * @param item - All possible parameters of the items data base (items database interface)
 * @param pubSubList - A map which contains a number and a string array (A pubsub)
 * @param ws - a websocket for communication
 * 
 * 
 */
export async function CheckDutchAuction(): Promise<itemDbRow[]> {
  //TODO check also if active
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM items WHERE auction_type='D' AND active='true'",
      (error, rows: itemDbRow[]) => {
        if (error) {
          console.log(error);
          return reject("Error occurred");
        }
        console.log("Found %o", rows);
        console.log("Reducing prices of these items ");
        rows.forEach((row)=>{
          if(row.price > 0){
            row.price = Math.round(row.price * 0.9 * 100) / 100;
          }
        })
        console.log("New items %o", rows);
        return resolve(rows);
      }
    );
  });
}
