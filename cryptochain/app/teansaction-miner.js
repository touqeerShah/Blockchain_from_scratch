const { Transaction } = require("../classes/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }
  mineTransaction() {
    // get only valid trans actions

    let validTransaction = this.transactionPool.validTransaction();
    // generate  reward
    validTransaction.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );
    // add block consisting of these transaction to the blockchain
    this.blockchain.addBlock({ data: validTransaction });
    // broadcast the updated blockchain
    this.pubsub.broadcastChain();
    // clear the pool
    this.transactionPool.clean();
  }
}

module.exports = { TransactionMiner };
