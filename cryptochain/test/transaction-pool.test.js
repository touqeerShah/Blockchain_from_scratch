const { Wallet } = require("../classes/wallet.js");
const { Transaction } = require("../classes/transaction.js");
const { TransactionPool } = require("../classes/transaction-pool.js");
const { assert, expect } = require("chai"); // Using Expect style
const { log } = require("console");
describe("Transaction Pool", async function () {
  let transactionPool, transaction;
  let senderWaller;
  let receiver;
  let amount;
  before(async () => {
    transactionPool = new TransactionPool();
    senderWaller = new Wallet();
    receiver = "receiver-public-key";
    amount = 50;
    transaction = new Transaction({ senderWaller, receiver, amount });
    // console.log(block);
  });
  describe("Set Transactions ", async function () {
    it("add a Transaction", function (done) {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).to.deep.equal(
        transaction
      );
      done();
    });
  });
  describe("Valid Transactions ", async function () {
    let validTransactions, transactionPool;
    before(async () => {
      transactionPool = new TransactionPool();

      validTransactions = [];
      for (let index = 0; index < 10; index++) {
        let transaction = new Transaction({
          senderWaller,
          receiver,
          amount: 3,
        });
        if (index % 3 === 0) {
          console.log("here 1", transaction.id);
          transaction.input.amount = 999999;
        } else if (index % 3 === 1) {
          console.log("here 2", transaction.id);

          transaction.input.signature = new Wallet().sign("foo");
        } else {
          console.log("here 3", transaction.id);

          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });
    it("return valid transaction", function (done) {
      console.log(
        "validTransactions",
        validTransactions,
        transactionPool.validTransaction()
      );
      expect(transactionPool.validTransaction()).to.deep.equal(
        validTransactions
      );
      done();
    });
  });
});
