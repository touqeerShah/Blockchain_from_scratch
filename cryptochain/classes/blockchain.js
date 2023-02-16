const { Block } = require('./block.js');
const { generateHash } = require("../utils")

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        this.chain.push(Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1], data
        }));
    }
    static isValidChain(chain) {
        console.log("here 1");

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            console.log("here 1");

            return false
        };
        for (let i=1; i<chain.length; i++) {
          const { timeStamp, lastHash, hash, data } = chain[i];
          console.log("lastHash 3",i,timeStamp,lastHash ,data);

          const actualLastHash = chain[i-1].hash;
        //   const lastDifficulty = chain[i-1].difficulty;
    
          if (lastHash !== actualLastHash) return false;
          console.log("here 2");

          const validatedHash = generateHash(timeStamp,lastHash,data);
          console.log("here 3",i,hash , validatedHash);

          if (hash !== validatedHash) return false;

        //   if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        console.log("here 4");

        return true;
      }
      replaceChain(chain){

      }
}

module.exports = { Blockchain }