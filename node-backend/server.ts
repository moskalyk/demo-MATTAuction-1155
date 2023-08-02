require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { auth } from '.'
const Corestore = require("corestore")

const PORT = process.env.PORT || 5000
const OWNER_ADDRESS = '0x'
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000',"http://155.138.139.22"],
};
  
app.use(cors(corsOptions));
app.use(bodyParser.json())

const corestore = new Corestore('./db')
const bids = corestore.get({name: "bids", valueEncoding: 'json'})

const ethAuthProofMiddleware = async (req, res, next) => {
    try{
        console.log(req.body.address, req.body.ethAuthProofString)
        if(await auth(req.body.address, req.body.ethAuthProofString)){
            next()
        } else {
            throw Error('Not Authorized')
        }
    }catch(e){
        res.send({msg: e, status: 500})
    }
};

app.use('/bid', ethAuthProofMiddleware);

app.post('/bid', async (req: any, res: any) => {
    console.log({
        bidder: req.body.address,
        amount: req.body.amount,
        tokenID: req.body.tokenID,
    })
    try{
        await bids.append({
            bidder: req.body.address,
            amount: req.body.amount,
            tokenID: req.body.tokenID,
        })
        res.send({bid: await bids.get(bids.length - 1), status: 200})
    }catch(err){
        res.send({msg: JSON.stringify(err), status: 500})
    }
})

app.post('/bids', async (req: any, res: any) => {
    try{
        // if(await auth(OWNER_ADDRESS, req.body.ethAuthProofString)){
            const fullStream = bids.createReadStream()
            const bidsTemp: any = {}
            for await (const bid of fullStream) {
                if(!bidsTemp[bid.tokenID]){
                    bidsTemp[bid.tokenID] = []
                }
                bidsTemp[bid.tokenID].push({
                    bidder: bid.bidder,
                    amount: bid.amount,
                })
            }
            const prices: any = []
            const bidders: any = []
            
            console.log(bidsTemp)
            
            for (const key in bidsTemp) {
                const amounts: any = []
                if(key != 'undefined'){
                    if (bidsTemp[key].length > 0) {
                        if(!bidders[Number(key)]) bidders[Number(key)] = []
                        bidsTemp[key].forEach((item) => {
                            amounts.push(Number(item.amount));
                            bidders[key].push(item.bidder)
                        });
                    }
                    let max = 0
                    let price = 0
                    let bidPrices = amounts
                    for(let i = 0; i < bidPrices.length; i++){
                        let tempPrice = bidPrices[i]*(bidPrices.length - i)
                        if(tempPrice > max) {
                            max = tempPrice 
                            price = bidPrices[i]
                        }
                    }   
                    prices.push({price: price, max: max, tokenID: key})
                }
            }
            res.send({prices: prices, status: 200, bidders: bidders.filter(bidder => bidder !== null)})
        // } else {
            // throw Error('Not Authorized')
        // }
    }catch(err){
        res.send({msg: JSON.stringify(err), status: 500})
    }
})

app.listen(PORT, async () => {
    console.log(`listening on port: ${PORT}`)
})