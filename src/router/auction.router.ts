import { Router } from "express";
import AuctionController from "../controllers/auction.controller.js";

export default class AuctionRouter{

    router: Router
    private controller: AuctionController

    constructor(){
        this.router = Router();
        this.controller = new AuctionController();
        this.routes();
    }

    private routes(){
        this.router.route('/').get(this.controller.get);
        this.router.route('/:id_card').get(this.controller.getById);
    }
}



