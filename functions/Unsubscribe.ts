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
