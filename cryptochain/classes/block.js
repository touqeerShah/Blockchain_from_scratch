const { GENESIS_DATA } = require('../config');

class Block {
  constructor({data, hash, lastHash,timeStamp}) { // { } bracket help to send argument in any order with sequence
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
    this.timeStamp=timeStamp
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
}

module.exports= {Block}