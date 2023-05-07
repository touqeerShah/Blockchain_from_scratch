const { Wallet } = require("../classes/wallet.js");
const { Transaction } = require("../classes/transaction.js");
const { TransactionPool } = require("../classes/transaction-pool.js");
const { assert, expect } = require("chai"); // Using Expect style
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
  describe("Existing Transactions ", async function () {
    it("return Existing Transaction", function (done) {
      transactionPool.setTransaction(transaction);

      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWaller.publicKey,
        })
      ).to.deep.equal(transaction);
      done();
    });
  });
});
