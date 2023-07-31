require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { auth } from '.'
const Corestore = require("corestore")

const PORT = process.env.PORT || 5000
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000',"*"],
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

app.get('/bids', async (req: any, res: any) => {
    try{
        const fullStream = bids.createReadStream()
        const bidsRaw = []
        for await (const bid of fullStream) {
            bidsRaw.push({
                bidder: bid.bidder,
                amount: bid.amount,
                tokenID: bid.tokenID,
            })
        }
        res.send({bids: bidsRaw, status: 200})
    }catch(err){
        res.send({msg: JSON.stringify(err), status: 500})
    }
})

app.listen(PORT, async () => {
    console.log(`listening on port: ${PORT}`)
})