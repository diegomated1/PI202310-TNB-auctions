import mongoose from 'mongoose';
import db from '../database/database.js';

const AuctionModel = db.model('auctions', new mongoose.Schema({
    _id: String,
    id_user: String,
    id_card: String,
    created: Date,
    time: Number,
    bidders: [{
        id_user: String,
        coins: Number,
        cards: [String],
        time: Date
    }],
    min_coins: Number,
    insta_win: [String]
}));

export default AuctionModel;