/**
 * Takes the username and ID of an item and unsubscribes the user from the item.
 * 
 * @param username - The username of the user
 * @param itemID  - The ID of a specific item
 * @param pubSubList - The pubsub map
 */
export function unsubscribe(
  username: string,
  itemID: number,
  pubSubList: Map<number, string[]>
) {
  const currentWatchingUsers = pubSubList.get(itemID);
  if (currentWatchingUsers != undefined) {
    const index = currentWatchingUsers.indexOf(username);
    if (index > -1) {
      currentWatchingUsers.splice(index, 1);
    }
    pubSubList.set(itemID, currentWatchingUsers);
  }
  console.log("Pubsub list: ");
  console.log(pubSubList);
}
