import { Request, Response } from "express";
import AuctionModel from "../models/auction.models.js";

export default class AuctionController{

    constructor(){
    }

    async get(req:Request, res:Response){
        try{
            const auctions = await AuctionModel.find();
            res.status(200).json({data: auctions});
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

    async getById(req:Request, res:Response){
        try{
            const {id_card} = req.params;
            const auction = await AuctionModel.findById(id_card);
            if(auction){
                res.status(200).json({data: auction});
            }else{
                res.status(404).json({'message': 'Auction not found'});
            }
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

}