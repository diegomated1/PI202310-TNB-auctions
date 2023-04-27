import IBid from "./IBid";

export default interface IAuction{
    _id: string,
    id_user: string,
    id_card: string,
    created: Date,
    time: number, 
    bids: [IBid],
    min_coins: number,
    insta_win: [string]
}
