const express = require('express');
const axios = require("axios")

const { Blockchain } = require('./classes/blockchain');
const PubSub = require('./app/pubsub');
// const Sub = require('./classes/sub');

const app = express();
app.use(express.json())    // <==== parse request body as JSON
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`
let testPubSub = async () => {
    await pubsub.setupConnection();
    pubsub.broadcastChain()

}
testPubSub();


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    console.log("req.body", req.body);
    const { data } = req.body;

    blockchain.addBlock({ data });
    pubsub.broadcastChain()

    res.redirect('/api/blocks');
});



let PEE_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

let syncChain = async () => {
    let rootChain;
    axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`)
        .then(function (response) {
            // handle success
            // console.log(response.data);
            rootChain = response.data

            blockchain.replaceChain(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            console.log('replace chain on a sync with', rootChain);
        });

}


let PORT = PEE_PORT || DEFAULT_PORT
app.listen(PORT, async () => {
    console.log(`listening at localhost:${PORT}`);
    PORT != DEFAULT_PORT ? await syncChain() : "";

});


