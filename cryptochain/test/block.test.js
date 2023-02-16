const { Block } = require('../classes/block.js');
const { generateHash, getTimeStamp } = require("../utils")
const { assert, expect } = require('chai');  // Using Expect style
const { getGenesisData } = require('../config');
const { resolve } = require('path');

describe('genesisBlock', async function () {
  let timeStamp;
  let lastHash = '';
  let hash;
  let data;
  let block, genesisBlock;
  before(async () => {
    genesisBlock = Block.genesis();

    timeStamp = getTimeStamp();
    lastHash = '';
    hash = generateHash(timeStamp,lastHash,'bar-hash');
    data = ['blockchain', 'data'];
    block = new Block({ timeStamp, lastHash, hash, data });
    // console.log(block);
  });
  it('Check Values are set', function (done) {

    assert.equal(block.timeStamp, timeStamp);
    assert.equal(block.lastHash, lastHash);
    assert.equal(block.hash, hash);
    assert.equal(block.data, data);
    done();
  });
  it('check genesis instance', function (done) {
    assert.equal(genesisBlock instanceof Block, true);
    done();
  });


});

describe('mineBlock', async function () {
  let timeStamp;
  let lastBlock = '';
  let hash;
  let data;
  let block, mineBlock;
  let GENESIS_DATA
  before(async () => {
    lastBlock =  Block.genesis();
    data = "new Transaction happend"
    mineBlock =  Block.mineBlock({lastBlock, data});

    console.log(mineBlock);
  });
  it('check mineBlock instance', function (done) {
    assert.equal(mineBlock instanceof Block, true);
    done();
  });

  it('set the `lastHash` equal to `hash` of lastBlock', function (done) {
    assert.equal(mineBlock.lastHash, lastBlock.hash);
    done();
  });

  it('check timestamp is define', function (done) {
    assert.notEqual(mineBlock.timeStamp, undefined);
    done();
  });
  it('check hash', function (done) {
    assert.equal(mineBlock.hash, generateHash(mineBlock.timeStamp,lastBlock.hash,data));
    done();
  });


});