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