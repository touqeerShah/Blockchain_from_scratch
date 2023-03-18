const { Block } = require('./block.js');
const { generateHash } = require("../utils")

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    console.log("data", data);

    let newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1], data: data
    })
    console.log("=== ", newBlock);
    this.chain.push(newBlock);
  }
  static isValidChain(chain) {
    console.log("here 1");

    if (JSON.stringify(chain[0]) != JSON.stringify(Block.genesis())) {
      console.log("here 1", JSON.stringify(chain[0]));
      console.log("here 1", JSON.stringify(Block.genesis()));

      return false
    };
    for (let i = 1; i < chain.length; i++) {
      const { timeStamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      // console.log("lastHash 3", i, timeStamp, lastHash, data);

      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) return false;
      console.log("here 2");

      const validatedHash = generateHash(timeStamp, lastHash, data, nonce, difficulty);
      // console.log("here 3", i, hash, validatedHash);

      if (hash !== validatedHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }
    console.log("here 4");

    return true;
  }
  replaceChain(chain) {
    console.log("this.chain.length<=chain.length", chain.length, this.chain.length);
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer');
      return;
    }

    console.log("Blockchain.isValidChain(chain)", Blockchain.isValidChain(chain));
    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain is not valid');
      return;
    }
    this.chain = chain;
  }
}

module.exports = { Blockchain }