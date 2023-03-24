/**
 * Takes the username and item ID and subscribes the user to the appropriate item.
 * 
 * 
 * @param username - The username of the user
 * @param itemID - The item ID of a specific item
 * @param pubSubList - The map which contains a number and string array of all active subscriptions (A pubsub)
 * 
 */

export function subscribe(username: string, itemID: number, pubSubList: Map<number, string[]>){
    const currentWatchingUsers = pubSubList.get(itemID);
    if(currentWatchingUsers != undefined){
        currentWatchingUsers.push(username);
        pubSubList.set(itemID, currentWatchingUsers);
    }else{
        pubSubList.set(itemID, [username]);
    }
    console.log("Pubsub list: ");
    console.log(pubSubList);
}