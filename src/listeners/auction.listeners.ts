import IAuction from "interfaces/IAuction.js";
import { Server, Socket } from "socket.io";
import ui from 'uniqid';

import AuctionModel from "../models/auction.models.js";

/*

#GET     /auction/cards
#POST    /auction/cards

#DELETE  /auction/cards/:id_card
#GET     /auction/cards/:id_card/auctions
#POST    /auction/cards/:id_card/auctions
#DELETE  /auction/cards/:id_card/auctions

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
            this.io.emit('post:auctions', _auction);
        }catch(error){
            //this.socket.emit('post:auctions');
        }
    }

    private async deleteAuction(id_auction:string){
        try{
            await AuctionModel.findByIdAndDelete(id_auction);
            this.io.emit('delete:auctions', id_auction);
        }catch(error){
            //this.socket.emit('delete:auction');
        }
    }

    private async createBidd(id_auction:string, id_user:string, coins:number, cards:string[]){
        try{
            const auction = await AuctionModel.findById(id_auction);
            if(auction){
                const bidd = {id_user, coins, cards, time: new Date()};
                auction.bidders.push(bidd);
                await auction.save();
                this.io.emit('post:auctions:bidd', id_auction, bidd);
            }
        }catch(error){
            //this.socket.emit('post:auctions:bidd');
        }
    }

    private async deleteBidd(id_auction:string, id_user:string){
        try{
            await AuctionModel.updateOne(
                { _id: id_auction },
                { $pull: { bidders: { id_user } } }
            );
            this.io.emit('delete:auctions:bidd', id_auction, id_user);
        }catch(error){
            //this.socket.emit('delete:auctions:bidd');
        }
    }

    listeners(){
        this.socket.on('post:auctions', this.createAuction);
        this.socket.on('delete:auctions', this.deleteAuction);
        this.socket.on('post:auctions:bidd', this.createBidd);
        this.socket.on('delete:auctions:bidd', this.deleteBidd);
    }

}