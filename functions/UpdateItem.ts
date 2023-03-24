import sqlite3  from "sqlite3";
import { itemDbRow } from "../types/interfaces";

const db = new sqlite3.Database("../db/items.db", (error) => {
    if (error) {
      console.error(error.message);
    }
    console.log("Connected to the items database.");
  });

/**
 * updates the the status of the item and saves it to the db
 * 
 * @param item the item to update
 */
export async function updateItem(item: itemDbRow) {
    console.log("Updating db with new item %o", item);
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE items SET active=?, top_bidder=?, price=? WHERE item_id=?",
        [
          `"${item.active}"`,
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