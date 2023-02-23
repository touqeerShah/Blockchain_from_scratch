var hexToBinary = require('hex-to-binary');

const { time, timeStamp } = require('console');
const { GENESIS_DATA, MINE_RATE, getGenesisData } = require('../config');
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
    let difficulty = lastBlock.difficulty
    let nonce = 0;
    do {
      nonce++;
      timeStamp = getTimeStamp()
      difficulty = this.adjustDifficulty({ originalBlock: lastBlock, timeStamp })
      newHash = generateHash(timeStamp, lastHash, data, nonce, difficulty);

    } while (hexToBinary(newHash).substring(0, difficulty) !== "0".repeat(difficulty))



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

  static adjustDifficulty({ originalBlock, timeStamp }) {
    if (originalBlock.difficulty < 0) return 1;
    return (timeStamp - originalBlock.timeStamp) > MINE_RATE ? originalBlock.difficulty - 1 : originalBlock.difficulty + 1;
  }

}

module.exports = { Block }