const { STARTING_BALANCE } = require("./../config");
const { ec } = require("./../utils/generateKey");
const { generateHash } = require("./../utils");
const { Transaction } = require("./transaction.js");
const { log } = require("console");

class Wallet {
  constructor() {
    // { } bracket help to send argument in any order with sequence
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode("hex");
  }
  sign(data) {
    return this.keyPair.sign(generateHash(data));
  }
  createTransaction({ amount, receiver, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain: chain,
        address: this.publicKey,
      });
    }
    if (this.balance < amount) {
      console.error("Amount exceeds balance");
      throw new Error("Amount exceeds balance");
    }
    return new Transaction({ senderWaller: this, receiver, amount });
  }
  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
}

module.exports = { Wallet };
