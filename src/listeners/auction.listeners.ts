import IAuction from "interfaces/IAuction.js";
import { Server, Socket } from "socket.io";
import ui from 'uniqid';

import AuctionModel from "../models/auction.models.js";
import IBId from "../interfaces/IBid";

export default class AuctionListeners{
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket){
        this.socket = socket;
        this.io = io;
        this.listeners();
    }

    private createAuction = async (auction:IAuction)=>{
        try{
            const _auction = await AuctionModel.create({
                _id: ui.process(),
                id_user: auction.id_user,
                id_card: auction.id_card,
                created: new Date(),
                time: auction.time,
                bids: [],
                min_coins: auction.min_coins,
                insta_win: auction.insta_win
            });
            this.socket.emit('create:auction', _auction);
            this.io.to('auctions').emit('create:auction', _auction);
        }catch(error){
            //this.socket.emit('post:auctions');
        }
    }

    private deleteAuction = async (id_auction:string)=>{
        try{
            await AuctionModel.findByIdAndDelete(id_auction);
            this.io.to(`auction:${id_auction}`).emit('delete:auction', id_auction);
            this.io.to('auctions').emit('delete:auction', id_auction);
        }catch(error){
            //this.socket.emit('delete:auction');
        }
    }

    private createBid = async (id_auction:string, id_user:string, coins:number, cards:string[])=>{
        try{
            const auction = await AuctionModel.findById(id_auction);
            if(auction){
                const bid:IBId = {id_user, coins, cards, time: new Date()};
                auction.bids.push(bid);
                await auction.save();
                this.io.to(`auction:${id_auction}`).emit('create:bid', id_auction, bid);
            }
        }catch(error){
            //this.socket.emit('post:auctions:bidd');
        }
    }

    private deleteBid = async (id_auction:string, id_user:string)=>{
        try{
            await AuctionModel.updateOne(
                { _id: id_auction },
                { $pull: { bids: { id_user } } }
            );
            this.io.to(`auction:${id_auction}`).emit('delete:bid', id_auction, id_user);
            //this.io.to('auctions').emit('delete:bid', id_auction, id_user);
        }catch(error){
            //this.socket.emit('delete:auctions:bidd');
        }
    }

    listeners(){
        this.socket.on('create:auction', this.createAuction);
        this.socket.on('delete:auction', this.deleteAuction);
        this.socket.on('create:bid', this.createBid);
        this.socket.on('delete:bid', this.deleteBid);
    }

}