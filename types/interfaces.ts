enum auction_type{
    'F',
    'D'
}

export interface websockData {
    action: string,
    username: string,
    item: number
}

export interface itemDbRow {
    item_id: number,
    item_name: string,
    description: string,
    top_bidder: string,
    price: number,
    shipping_cost: number,
    active: boolean,
    auction_type: auction_type,
    end_time: Date
}

export interface publishData {
    action: string,
    username: string,
    item: itemDbRow
}