const { Transaction } = require("./transaction");

class TransactionPool {
  constructor() {
    // { } bracket help to send argument in any order with sequence
    this.transactionMap = {};
    this.conunt = 0;
  }

  setTransaction(transaction) {
    // console.log("setTransaction ", this.conunt++, transaction);
    this.transactionMap[transaction.id] = transaction;
  }
  clean() {
    // console.log("setTransaction ", this.conunt++, transaction);
    this.transactionMap = {};
  }
  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);
    // console.log("transactions", transactions);
    return transactions.find(
      (transaction) => transaction.input.address === inputAddress
    );
  }
  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }
  validTransaction() {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validateTransactions(transaction)
    );
  }
  clearBlockchainTransactions({ chain }) {
    console.log("clearBlockchainTransactions");
    for (let index = 1; index < chain.length; index++) {
      const block = chain[index];
      console.log("block ==>", block);
      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }
}

module.exports = { TransactionPool };
