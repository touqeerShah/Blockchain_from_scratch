const {Block} = require( '../classes/block.js');
const {generateHash,getTimeStamp}= require ("../utils")
const { assert,expect } = require ('chai');  // Using Expect style
const { getGenesisData } = require('../config');
const { resolve } = require('path');

describe('Testing the Cube Functions',async function() {
    let timeStamp;
    let lastHash = '';
    let hash ;
    let data ;
    let block   ,genesisBlock;
    let  GENESIS_DATA
  before(async () => {
     genesisBlock =await  Block.genesis();

    console.log(genesisBlock);
    timeStamp = getTimeStamp();
     lastHash = '';
     hash =await generateHash('bar-hash');
     data = ['blockchain', 'data'];
     block = new Block({ timeStamp, lastHash, hash, data });
    // console.log(block);
  });
    it('Check Values are set', function(done) {
   
        assert.equal(block.timeStamp,timeStamp);
        assert.equal(block.lastHash,lastHash);
        assert.equal(block.hash,hash);
        assert.equal(block.data,data);
    done();
    });
    it('check genesis instance', function(done) {
        assert.equal(genesisBlock instanceof Block,true);
    done();
    });

  
    
});