export default interface IAuction{
    _id: string,
    id_user: string,
    id_card: string,
    time: number, 
    bidders: {
        id_user: string,
        coins: number,
        cards: [string],
        time: Date
    }[],
    min_coins: number,
    insta_win: [string]
}
