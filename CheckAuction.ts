import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./db/items.db", (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Connected to the items database.");
});

export async function CheckAuction(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const currentTime = new Date().getTime();
    db.all(
      "SELECT item_name FROM items WHERE auction_type=F AND end_time<=?",
      [currentTime],
      (error, rows) => {
        if (error) {
          console.log(error);
          return reject("Error occurred");
        }
        console.log("success");
        return resolve(rows as string[]);
      }
    );
  });
}
