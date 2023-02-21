const { time, timeStamp } = require('console');
const { GENESIS_DATA, getGenesisData } = require('../config');
const { generateHash, getTimeStamp } = require("../utils")

class Block {
  constructor({ data, hash, lastHash, timeStamp, nonce, difficulty }) { // { } bracket help to send argument in any order with sequence
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
    this.timeStamp = timeStamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(getGenesisData());
  }
  static mineBlock({ lastBlock, data }) {
    let newHash, timeStamp;
    const lastHash = lastBlock.hash
    const difficulty = lastBlock.difficulty

    let nonce = 0;
    do {
      nonce++;
      timeStamp = getTimeStamp()
      newHash = generateHash(timeStamp, lastHash, data, nonce, difficulty);

    } while (newHash.substring(0, difficulty) !== "0".repeat(difficulty))



    return new this(
      {
        timeStamp,
        hash: newHash,
        lastHash,
        data,
        nonce,
        difficulty
      }
    )
  }

}

module.exports = { Block }