export function subscribe(
  username: string,
  itemID: number,
  pubSubList: Map<number, string[]>
) {
  const currentWatchingUsers = pubSubList.get(+itemID);
  console.log(currentWatchingUsers);
  if (
    currentWatchingUsers != undefined &&
    !currentWatchingUsers.includes(username)
  ) {
    currentWatchingUsers.push(username);
    pubSubList.set(+itemID, currentWatchingUsers);
  } else if (currentWatchingUsers == undefined) {
    pubSubList.set(+itemID, [username]);
  }
  console.log("Pubsub list: ");
  console.log(pubSubList);
}
