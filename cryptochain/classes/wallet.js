const { STARTING_BALANCE } = require("./../config")
const { ec } = require("./../utils/generateKey")
const { generateHash } = require("./../utils")
const { Transaction } = require("./transaction.js");


class Wallet {
    constructor() { // { } bracket help to send argument in any order with sequence
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();;

        this.publicKey = this.keyPair.getPublic().encode("hex");

    }
    sign(data) {
        return this.keyPair.sign(generateHash(data));
    }
    createTransaction({ amount, receiver }) {
        if (this.balance < amount) {
            console.error("Amount exceeds balance");
            throw new Error('Amount exceeds balance');
        }
        return new Transaction({ senderWaller: this, receiver, amount })
    }
}

module.exports = { Wallet }