const { GENESIS_DATA ,getGenesisData} = require('../config');

class Block {
  constructor({data, hash, lastHash,timeStamp}) { // { } bracket help to send argument in any order with sequence
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
    this.timeStamp=timeStamp
  }
  static async genesis() {
    return new this(await getGenesisData());
  }
}

module.exports= {Block}