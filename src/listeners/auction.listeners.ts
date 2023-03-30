import IAuction from "interfaces/IAuction.js";
import { Server, Socket } from "socket.io";
import ui from 'uniqid';

import AuctionModel from "../models/auction.models.js";

/*

GET     /auction/cards
POST    /auction/cards

DELETE  /auction/cards/:id_card
GET     /auction/cards/:id_card/auctions
POST    /auction/cards/:id_card/auctions
DELETE  /auction/cards/:id_card/auctions

*/

export default class AuctionListeners{
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket){
        this.socket = socket;
        this.io = io;
        this.listeners();
    }

    private async createAuction(auction:IAuction){
        try{
            const _auction = await AuctionModel.create({
                _id: ui.process(),
                id_user: auction.id_user,
                id_card: auction.id_card,
                created: new Date(),
                time: auction.time,
                bidders: [],
                min_coins: auction.min_coins,
                insta_win: auction.insta_win
            });
            this.socket.emit('post:auctions', _auction);
        }catch(error){
            this.socket.emit('post:auctions');
        }
    }

    listeners(){
        this.socket.on('post:auctions', this.createAuction);
    }

}