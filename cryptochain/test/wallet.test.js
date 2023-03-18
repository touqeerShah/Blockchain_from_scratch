const { Wallet } = require("../classes/wallet.js");
const { Transaction } = require("../classes/transaction.js");

const { verifySignature } = require("./../utils");
const { assert, expect } = require("chai"); // Using Expect style

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
                amount = 90000
                expect(() => { wallet.createTransaction({ amount: amount, receiver: receiver.publicKey }) }).to.throw(("Amount exceeds balance"))
                done();
            });
        });
        describe("ans the amount  is valid", async function () {
            before(async () => {
                amount = 10

                transaction = wallet.createTransaction({ amount: amount, receiver: receiver.publicKey });
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
        });
    });
});
