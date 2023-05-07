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
}

module.exports = { TransactionPool };
