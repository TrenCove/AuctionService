import sqlite3  from "sqlite3";
import { itemDbRow } from "../types/interfaces";
/**
 * updates the the status of the item.
 * 
 * @param topbidder - The username of the highest bidder for the item
 * @param itemID  - The ID of a specific item
 * @param price - The highest price for this item
 * @param active - Determines if the item availability
 */
const db = new sqlite3.Database("../db/items.db", (error) => {
    if (error) {
      console.error(error.message);
    }
    console.log("Connected to the items database.");
  });

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