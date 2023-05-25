const express = require("express");
const axios = require("axios");

const { Blockchain } = require("./classes/blockchain");
const { TransactionPool } = require("./classes/transaction-pool");
const { Wallet } = require("./classes/wallet");
const { TransactionMiner } = require("./app/teansaction-miner");
const PubSub = require("./app/pubsub");
const { Transaction } = require("./classes/transaction");
const { log } = require("console");
// const Sub = require('./classes/sub');

const app = express();
app.use(express.json()); // <==== parse request body as JSON
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
let testPubSub = async () => {
  await pubsub.setupConnection();
  pubsub.broadcastChain();
};
testPubSub();

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  console.log("req.body", req.body);
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});
app.post("/api/transact", (req, res) => {
  const { amount, receiver } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });
  console.log(
    transaction,
    "transaction after",
    transaction instanceof Transaction
  );
  try {
    if (transaction) {
      transaction.update({ senderWaller: wallet, receiver, amount });
    } else {
      transaction = wallet.createTransaction({
        amount,
        receiver,
        chain: blockchain.chain,
      });
    }
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }
  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);
  res.json({ type: "success", transaction });
});
app.get("/api/get-transact-pool-map", (req, res) => {
  res.status(200).json(transactionPool.transactionMap);
});

app.get("/api/mine-transaction", (req, res) => {
  transactionMiner.mineTransaction();
  res.redirect("/api/blocks");
});

app.get("/api/wallet-info", (req, res) => {
  res.status(200).json({
    address: wallet.publicKey,
    balance: Wallet.calculateBalance({
      chain: blockchain.chain,
      address: wallet.publicKey,
    }),
  });
});

let PEE_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

let syncWithRootState = async () => {
  let rootChain, rootTransaction;
  axios
    .get(`${ROOT_NODE_ADDRESS}/api/blocks`)
    .then(function (response) {
      // handle success
      // console.log(response.data);
      rootChain = response.data;

      blockchain.replaceChain(rootChain);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      //   console.log("replace chain on a sync with", rootChain);
    });
  axios
    .get(`${ROOT_NODE_ADDRESS}/api/get-transact-pool-map`)
    .then(function (response) {
      // handle success
      // console.log(response.data);
      if (response.status == 200) {
        rootTransaction = response.data;
        console.log("rootChain", rootChain);
        transactionPool.setMap(rootTransaction);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      console.log("replace transaction on a sync with");
    });
};

let PORT = PEE_PORT || DEFAULT_PORT;
app.listen(PORT, async () => {
  console.log(`listening at localhost:${PORT}`);
  PORT != DEFAULT_PORT ? await syncWithRootState() : "";
});
