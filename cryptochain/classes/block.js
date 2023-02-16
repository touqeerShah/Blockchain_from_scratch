const { time, timeStamp } = require('console');
const { GENESIS_DATA, getGenesisData } = require('../config');
const { generateHash, getTimeStamp } = require("../utils")

class Block {
  constructor({ data, hash, lastHash, timeStamp }) { // { } bracket help to send argument in any order with sequence
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
    this.timeStamp = timeStamp
  }
  static genesis() {
    return new this(getGenesisData());
  }
  static  mineBlock({ lastBlock, data }) {
    const timeStamp=getTimeStamp()
    const lastHash=lastBlock.hash
    let newHash = generateHash(timeStamp,lastHash,data);

    return new this(
      {
        timeStamp,
        hash: newHash,
        lastHash,
        data
      }
    )
  }

}

module.exports = { Block }