
const { Wallet } = require("../classes/wallet.js");
const { verifySignature } = require("./../utils")
const { assert, expect } = require("chai"); // Using Expect style

describe("Wallet", async function () {
    let wallet;

    before(async () => {
        wallet = new Wallet();


        // console.log(block);
    });
    it("has a balance", function (done) {
        // assert.deepProperty(wallet, "balance")
        expect(wallet).to.have.own.property('balance');

        done();
    });
    it("hash a publicKey", function (done) {
        // console.log("wallet", wallet);
        expect(wallet).to.have.own.property('publicKey');
        done();
    });
    describe("Signature", async function () {
        const data = "786"
        it("Verify signature", function (done) {
            // console.log("wallet.sign(data) ", wallet.sign(data));
            assert.equal(verifySignature({ publicKey: wallet.publicKey, data: data, signature: wallet.sign(data) }), true);

            done();
        });
        it("Verify Signature is not Valid", function (done) {
            // console.log("wallet", wallet);
            assert.equal(verifySignature({ publicKey: wallet.publicKey, data: data, signature: new Wallet().sign(data) }), false);
            done();
        });
    });

});

