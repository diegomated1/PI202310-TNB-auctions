import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';
import http from 'http';
import io from 'socket.io';
import AuctionRouter from './router/auction.router.js';
import AuctionListeners from './listeners/auction.listeners.js';
import cors from 'cors';

class App{

    app: Application
    server: http.Server
    io: io.Server
    AuctionRouter: AuctionRouter

    constructor(){
        this.app = express();
        this.server = new http.Server(this.app);
        this.io = new io.Server(this.server, {
            cors: {
                origin: '*'
            }
        });
        this.AuctionRouter = new AuctionRouter();
        this.config();
        this.routes();
        this.start();
    }

    config(){
        dotenv.config();
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use('/auctions', this.AuctionRouter.router);
    }

    start(){
        this.io.on('connection', (socket)=>{
            const {id_auction} = socket.handshake.query;
            if(id_auction){
                socket.join(`auction:${id_auction}`);
            }else{
                socket.join('auctions');
            }
            new AuctionListeners(this.io, socket);
        });

        this.server.listen(parseInt(process.env.API_PORT||'3000'));
    }

}

const app = new App();