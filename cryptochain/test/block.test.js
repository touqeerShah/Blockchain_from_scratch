const {Block} = require( '../classes/block.js');
const {generateHash,getTimeStamp}= require ("../utils")
const { assert,expect } = require ('chai');  // Using Expect style
const { GENESIS_DATA } = require('../config');

describe('Testing the Cube Functions',async function() {
    let timeStamp;
    let lastHash = '';
    let hash ;
    let data ;
    let block   ,genesisBlock;

  before(async () => {
     genesisBlock = Block.genesis();

    timeStamp = getTimeStamp();
     lastHash = '';
     hash =await generateHash('bar-hash');
     data = ['blockchain', 'data'];
     block = new Block({ timeStamp, lastHash, hash, data });
    console.log(block);
  });
    it('Check Values are set', function(done) {
   
        assert.equal(block.timeStamp,timeStamp);
        assert.equal(block.lastHash,lastHash);
        assert.equal(block.hash,hash);
        assert.equal(block.data,data);
    done();
    });
    it('check genesis instance', function(done) {
        genesisBlock = Block.genesis();
        assert.equal(genesisBlock instanceof Block,true);
    done();
    });

    it('check genesis equal to config', function(done) {
        console.log("genesisBlock",genesisBlock);
        console.log("GENESIS_DATA",GENESIS_DATA);

        assert.equal(genesisBlock.timeStamp,GENESIS_DATA.timeStamp);
        assert.equal(genesisBlock.lastHash,GENESIS_DATA.lastHash);
        assert.equal(genesisBlock.hash,GENESIS_DATA.hash);
        assert.equal(genesisBlock.data,GENESIS_DATA.data);
    done();
    });
    
});