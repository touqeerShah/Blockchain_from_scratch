class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }
  mineTransaction() {
    // get only valid trans actions
    // generate  reward
    // add block consisting of these transaction to the blockchain
    // broadcast the updated blockchain
    // clear the pool
  }
}

module.exports = TransactionMiner;
