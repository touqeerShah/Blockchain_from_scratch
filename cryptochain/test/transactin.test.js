
const { Wallet } = require("../classes/wallet.js");
const { Transaction } = require("../classes/transaction.js");
const { verifySignature } = require("./../utils")
const { assert, expect } = require("chai"); // Using Expect style

describe("Transaction", async function () {
    let senderWaller;
    let receiver;
    let amount;
    let transaction;
    before(async () => {
        senderWaller = new Wallet();
        receiver = "receiver-public-key";
        amount = 50;
        transaction = new Transaction({ senderWaller, receiver, amount })
        // console.log(block);
    });
    it("has a id", function (done) {
        // assert.deepProperty(wallet, "balance")
        expect(transaction).to.have.own.property('id');
        done();
    });
    describe("Output Map", async function () {


        it("hash a outputMap", function (done) {
            expect(transaction).to.have.own.property('outputMap');
            done();
        });
        it("check amount to the receiver", function (done) {
            console.log("transaction", transaction.outputMap[receiver]);
            assert.equal(transaction.outputMap[receiver], amount);

            done();
        });
        it("check amount to the sender", function (done) {
            assert.equal(transaction.outputMap[senderWaller.publicKey], (senderWaller.balance - amount));

            done();
        });
    });

    describe("input Map", async function () {


        it("hash a input", function (done) {
            expect(transaction).to.have.own.property('input');
            done();
        });
        it("hash a input", function (done) {
            expect(transaction.input).to.have.own.property('timestamp');
            done();
        });
        it("set the amount to the senderWaller balance", function (done) {
            assert.equal(transaction.input.amount, senderWaller.balance);

            done();
        });
        it("check publickey to the sender", function (done) {
            assert.equal(transaction.input.address, senderWaller.publicKey);
            done();
        });
        it("verify signature to the sender", function (done) {
            assert.equal(verifySignature({ publicKey: transaction.input.address, data: transaction.outputMap, signature: transaction.input.signature }), true);
            done();
        });
    });

    describe("Transaction Validator", async function () {

        describe("when the Transaction Valid", async function () {

            it("transaction Valid", function (done) {
                assert.equal(Transaction.validateTransactions(transaction), true);
                done();
            });
        });
        describe("when the Transaction inValid", async function () {

            it("when the Transaction outputMap is not valid", function (done) {
                console.log("transaction", transaction);
                transaction.outputMap[senderWaller.publicKey] = 999999
                assert.equal(Transaction.validateTransactions(transaction), false);
                done();
            });
            it("when the Transaction signature is not valid", function (done) {
                transaction.outputMap[senderWaller.publicKey] = 950
                transaction.input.signature = new Wallet().sign("data")
                assert.equal(Transaction.validateTransactions(transaction), false);
                done();
            });
        });

    });

    describe("update ", async function () {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;
        describe("when amount is valid ", async function () {

            before(async () => {
                originalSignature = transaction.input.signature;
                originalSenderOutput = transaction.outputMap[senderWaller.publicKey];
                nextRecipient = "next-public-key";
                nextAmount = 45;
                // console.log(block);
                transaction.update({ senderWaller, receiver: nextRecipient, amount: nextAmount })
            });

            it("outputs the amount to the next recipient", function (done) {
                assert.equal(transaction.outputMap[nextRecipient], nextAmount);

                done();
            });
            it("subtracts the amount from the original sender output amount", function (done) {
                assert.equal(transaction.outputMap[senderWaller.publicKey], originalSenderOutput - nextAmount);
                done();
            });
            it("check-signature", function (done) {
                console.log("check-signature", JSON.stringify(transaction.input.signature), " === ", JSON.stringify(originalSignature));
                assert.notEqual(transaction.input.signature, originalSignature);
                done();
            });
            it("transaction Valid", function (done) {
                assert.equal(Transaction.validateTransactions(transaction), true);
                done();
            });
        });
        describe("when amount is not valid ", async function () {

            before(async () => {
                originalSignature = transaction.input.signature;
                nextRecipient = "next2-public-key";
                nextAmount = 999999;
                // console.log(block);
            });

            it("throw an error", function (done) {
                // console.log("wallet", wallet);
                amount = 90000
                expect(() => { transaction.update({ senderWaller, receiver: nextRecipient, amount: nextAmount }) }
                ).to.throw(("Amount exceeds balance"))
                done();
            });


        });
        describe("update with some receiver ", async function () {
            let addnewAmount
            before(async () => {
                originalSignature = transaction.input.signature;
                nextRecipient = "next-public-key";
                addnewAmount = 10;
                nextAmount = 45;

                transaction.update({ senderWaller, receiver: nextRecipient, amount: addnewAmount })

                // console.log(block);
            });

            it("update existing receiver amount", function (done) {
                console.log("before update transaction", transaction);
                assert.equal(transaction.outputMap[nextRecipient], nextAmount + addnewAmount);


                console.log("after update transaction", transaction);

                done();
            });
            it("update existing sender amount", function (done) {
                console.log("before update transaction", originalSenderOutput);
                assert.equal(transaction.outputMap[senderWaller.publicKey], originalSenderOutput - nextAmount - addnewAmount);


                console.log("after update transaction", transaction);

                done();
            });


        });
    });


});

