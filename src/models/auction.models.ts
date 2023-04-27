import mongoose from 'mongoose';

const AuctionModel = mongoose.model('auctions', new mongoose.Schema({
    _id: String,
    id_user: String,
    id_card: String,
    created: Date,
    time: Number,
    bids: [{
        id_user: String,
        coins: Number,
        cards: [String],
        time: Date
    }],
    min_coins: Number,
    insta_win: [String]
}));

export default AuctionModel;