var hexToBinary = require('hex-to-binary');
const { Block } = require("../classes/block.js");
const { generateHash, getTimeStamp } = require("../utils");
const { assert, expect } = require("chai"); // Using Expect style
const { getGenesisData, MINE_RATE } = require("../config");
const { resolve } = require("path");

describe("genesisBlock", async function () {
  let timeStamp;
  let lastHash = "";
  let hash;
  let data;
  let block, genesisBlock;
  let nonce = 1;
  let difficulty = 1;
  before(async () => {
    genesisBlock = Block.genesis();

    timeStamp = getTimeStamp();
    lastHash = "";
    hash = generateHash(timeStamp, lastHash, "bar-hash");
    data = ["blockchain", "data"];
    block = new Block({ timeStamp, lastHash, hash, data, nonce, difficulty });
    // console.log(block);
  });
  it("Check Values are set", function (done) {
    assert.equal(block.timeStamp, timeStamp);
    assert.equal(block.lastHash, lastHash);
    assert.equal(block.hash, hash);
    assert.equal(block.data, data);
    assert.equal(block.nonce, nonce);
    assert.equal(block.difficulty, difficulty);

    done();
  });
  it("check genesis instance", function (done) {
    assert.equal(genesisBlock instanceof Block, true);
    done();
  });
});

describe("mineBlock", async function () {
  let timeStamp;
  let lastBlock = "";
  let hash;
  let data;
  let block, mineBlock;
  let GENESIS_DATA;
  before(async () => {
    lastBlock = Block.genesis();
    data = "new Transaction happend";
    mineBlock = Block.mineBlock({ lastBlock, data });

    console.log("mineBlock", mineBlock);
  });
  it("check mineBlock instance", function (done) {
    assert.equal(mineBlock instanceof Block, true);
    done();
  });

  it("set the `lastHash` equal to `hash` of lastBlock", function (done) {
    assert.equal(mineBlock.lastHash, lastBlock.hash);
    done();
  });

  it("check timestamp is define", function (done) {
    assert.notEqual(mineBlock.timeStamp, undefined);
    done();
  });
  it("check hash", function (done) {
    assert.equal(
      mineBlock.hash,
      generateHash(mineBlock.timeStamp, lastBlock.hash, data, mineBlock.nonce, mineBlock.difficulty)
    );
    done();
  });
  it("set a hash that match the difficulty  criteria", function (done) {
    let binaryHash = hexToBinary(mineBlock.hash)
    console.log("binaryHash", binaryHash);
    assert.equal(
      binaryHash.substring(0, mineBlock.difficulty),
      "0".repeat(mineBlock.difficulty)
    );
    done();
  });
  it("adjust the difficulty ", function (done) {
    const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]

    assert.equal(
      possibleResults.includes(mineBlock.difficulty), true
    );
    done();
  });
});
describe("Adjust Mine Difficulty ", async function () {
  let timeStamp;
  let lastBlock = "";
  let hash;
  let data;
  let block, mineBlock;
  let GENESIS_DATA;
  before(async () => {
    lastBlock = Block.genesis();
    data = "new Transaction happend";
    mineBlock = Block.mineBlock({ lastBlock, data });

    console.log("mineBlock", mineBlock);
  });
  it("raise the difficulty fro a quickly mined block", function (done) {
    let newDiddiculty = Block.adjustDifficulty({ originalBlock: mineBlock, timeStamp: mineBlock.timeStamp + MINE_RATE - 1000 })
    // console.log("newDiddiculty", newDiddiculty);
    assert.equal(mineBlock.difficulty + 1, newDiddiculty);

    done();
  });
  it("lower the difficulty fro a quickly mined block", function (done) {
    let newDiddiculty = Block.adjustDifficulty({ originalBlock: mineBlock, timeStamp: mineBlock.timeStamp + MINE_RATE + 1000 })
    console.log("newDiddiculty", newDiddiculty);
    assert.equal(mineBlock.difficulty - 1, newDiddiculty);
    done();
  });
  it("lower the difficulty fro a quickly mined block", function (done) {
    mineBlock.difficulty = -1
    let newDiddiculty = Block.adjustDifficulty({ originalBlock: mineBlock })
    assert.equal(1, newDiddiculty);
    done();
  });
});
