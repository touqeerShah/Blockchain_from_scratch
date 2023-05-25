const { Wallet } = require("../classes/wallet.js");
const { Transaction } = require("../classes/transaction.js");
const { Blockchain } = require("../classes/blockchain.js");

const { verifySignature } = require("./../utils");
const { assert, expect } = require("chai"); // Using Expect style
const { STARTING_BALANCE } = require("../config.js");

describe("Wallet", async function () {
  let wallet;
  let receiver;
  let amount;
  let transaction;

  before(async () => {
    wallet = new Wallet();

    // console.log(block);
  });
  it("has a balance", function (done) {
    // assert.deepProperty(wallet, "balance")
    expect(wallet).to.have.own.property("balance");

    done();
  });
  it("hash a publicKey", function (done) {
    // console.log("wallet", wallet);
    expect(wallet).to.have.own.property("publicKey");
    done();
  });
  describe("Signature", async function () {
    const data = "786";
    it("Verify signature", function (done) {
      // console.log("wallet.sign(data) ", wallet.sign(data));
      assert.equal(
        verifySignature({
          publicKey: wallet.publicKey,
          data: data,
          signature: wallet.sign(data),
        }),
        true
      );

      done();
    });
    it("Verify Signature is not Valid", function (done) {
      // console.log("wallet", wallet);
      assert.equal(
        verifySignature({
          publicKey: wallet.publicKey,
          data: data,
          signature: new Wallet().sign(data),
        }),
        false
      );
      done();
    });
  });

  describe("Create Transaction", async function () {
    before(async () => {
      receiver = new Wallet();
      amount = 10;
      // console.log(block);
    });
    describe("ans the amount exceed the balance", async function () {
      it("throw an error", function (done) {
        // console.log("wallet", wallet);
        amount = 90000;
        expect(() => {
          wallet.createTransaction({
            amount: amount,
            receiver: receiver.publicKey,
          });
        }).to.throw("Amount exceeds balance");
        done();
      });
    });
    describe("ans the amount  is valid", async function () {
      before(async () => {
        amount = 10;

        transaction = wallet.createTransaction({
          amount: amount,
          receiver: receiver.publicKey,
        });
        console.log("transaction", transaction);
      });
      it("creates an instance of Transaction", function (done) {
        assert.equal(transaction instanceof Transaction, true);
        done();
      });
      it("matches the transaction input with the wallet", function (done) {
        assert.equal(transaction.input.address, wallet.publicKey);
        done();
      });
      it("output the amount the recipient", function (done) {
        assert.equal(transaction.outputMap[receiver.publicKey], amount);

        done();
      });
      it("calls  Wallet calculate Balance", function (done) {
        wallet.createTransaction({
          chain: new Blockchain().chain,
          receiver: "foo",
          amount: 12,
        });

        done();
      });
    });
  });
  describe("Blockchain Balance", async function () {
    let blockchain;
    before(async () => {
      blockchain = new Blockchain();
    });
    describe("and there are no output on the wallet ", async function () {
      it("output the amount the recipient", function (done) {
        assert.equal(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
          STARTING_BALANCE
        );

        done();
      });
    });
    describe("and there are  output on the wallet ", async function () {
      let transaction1, transaction2;
      before(async () => {
        transaction1 = new Wallet().createTransaction({
          receiver: wallet.publicKey,
          amount: 12,
        });
        transaction2 = new Wallet().createTransaction({
          receiver: wallet.publicKey,
          amount: 20,
        });
        blockchain.addBlock({ data: [transaction1, transaction2] });
      });

      it("some of the amount the recipient", function (done) {
        assert.equal(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
          STARTING_BALANCE +
            transaction1.outputMap[wallet.publicKey] +
            transaction2.outputMap[wallet.publicKey]
        );

        done();
      });
    });
    describe("and the wallet has made transaction", async function () {
      let recentTransaction;
      let sender;
      before(async () => {
        sender = new Wallet();
        recentTransaction = sender.createTransaction({
          receiver: "foo",
          amount: 30,
        });
        blockchain.addBlock({ data: [recentTransaction] });
      });
      it("return the output amount of the recent Transaction", function (done) {
        console.log(
          sender.publicKey,
          "-asd-a-da-da-d-as",
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: sender.publicKey,
          })
        );
        assert.equal(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: sender.publicKey,
          }),
          recentTransaction.outputMap[sender.publicKey]
        );

        done();
      });
    });

    describe("and there are outputs next to and after the recent transaction", async function () {
      let recentTransaction, someBlockTransaction, nextBlockTransaction;
      let sender;
      before(async () => {
        sender = new Wallet();
        // send some amount
        recentTransaction = sender.createTransaction({
          receiver: "foo",
          amount: 30,
        });
        //get mining reward
        someBlockTransaction = Transaction.rewardTransaction({
          minerWallet: sender,
        });
        blockchain.addBlock({
          data: [someBlockTransaction, recentTransaction],
        });
        nextBlockTransaction = new Wallet().createTransaction({
          receiver: sender.publicKey,
          amount: 99,
        });
        blockchain.addBlock({
          data: [nextBlockTransaction],
        });
      });
      it("return the output amount of the recent Transaction", function (done) {
        console.log(
          sender.publicKey,
          "-asd-a-da-da-d-as",
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: sender.publicKey,
          })
        );
        assert.equal(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: sender.publicKey,
          }),
          recentTransaction.outputMap[sender.publicKey] +
            someBlockTransaction.outputMap[sender.publicKey] +
            nextBlockTransaction.outputMap[sender.publicKey]
        );

        done();
      });
    });
  });
});
