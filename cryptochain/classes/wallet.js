const { STARTING_BALANCE } = require("./../config")
const { ec } = require("./../utils/generateKey")
const { generateHash } = require("./../utils")

class Wallet {
    constructor() { // { } bracket help to send argument in any order with sequence
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();;

        this.publicKey = this.keyPair.getPublic().encode("hex");

    }
    sign(data) {
        return this.keyPair.sign(generateHash(data));
    }
}

module.exports = { Wallet }