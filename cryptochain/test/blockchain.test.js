const { Block } = require("../classes/block.js");
const { Blockchain } = require("../classes/blockchain.js");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");
const chai = require("chai");
chai.use(deepEqualInAnyOrder);

const { generateHash, getTimeStamp } = require("../utils");
const { assert, expect } = chai; // Using Expect style
const { getGenesisData } = require("../config");
const { resolve } = require("path");

describe("Blockchain", async function () {
  let timeStamp;
  let lastHash = "";
  let hash;
  let data;
  let block, genesisBlock;
  let blockchain;
  before(async () => {
    genesisBlock = Block.genesis();
    blockchain = new Blockchain();

    timeStamp = getTimeStamp();
    lastHash = "";
    hash = generateHash(timeStamp, lastHash, "bar-hash");
    data = ["blockchain", "data"];
    block = new Block({ timeStamp, lastHash, hash, data });
    // console.log(block);
  });
  it("contain a chain Array instance", function (done) {
    assert.equal(blockchain.chain instanceof Array, true);
    done();
  });
  it("start with genesis block", function (done) {
    expect(blockchain.chain[0]).to.deep.equalInAnyOrder(genesisBlock);

    // assert.equal(blockchain.chain[0], genesisBlock);
    done();
  });
  it("add new block in chain", function (done) {
    const data = "new Block transaction";
    blockchain.addBlock({ data });
    assert.equal(blockchain.chain[blockchain.chain.length - 1].data, data);
    done();
  });
});
describe("ValidChain()", async function () {
  describe("when chain does not started with genesis Block", async function () {
    let genesisBlock;
    let blockchain;
    before(async () => {
      genesisBlock = Block.genesis();
      blockchain = new Blockchain();
      blockchain.addBlock({ data: "new Block transaction 1" });
      blockchain.addBlock({ data: "new Block transaction 2" });
      // console.log(block);
    });
    it("return false", function (done) {
      blockchain.chain[0].data = "temper data";
      assert.equal(Blockchain.isValidChain(blockchain.chain), false);
      done();
    });
  });
  describe("lasthash has been change return false", async function () {
    let genesisBlock;
    let blockchain;
    before(async () => {
      genesisBlock = Block.genesis();
      blockchain = new Blockchain();
      blockchain.addBlock({ data: "new Block transaction 1" });
      blockchain.addBlock({ data: "new Block transaction 2" });
      // console.log(block);
    });
    it("lasthash has been change return false", function (done) {
      genesisBlock = Block.genesis();
      blockchain = new Blockchain();
      blockchain.addBlock({ data: "new Block transaction 1" });
      blockchain.addBlock({ data: "new Block transaction 2" });
      console.log("blockchain.chain.length", blockchain.chain.length);
      blockchain.chain[blockchain.chain.length - 1].lastHash = "temper hash";

      assert.equal(Blockchain.isValidChain(blockchain.chain), false);
      done();
    });
    it("return false", function (done) {
      blockchain.chain[2].data = "temper hash";

      assert.equal(Blockchain.isValidChain(blockchain.chain), false);
      done();
    });
  });
  describe("chain have block with invalid field", async function () {
    it("return false", function (done) {
      let genesisBlock;
      let blockchain;
      genesisBlock = Block.genesis();
      blockchain = new Blockchain();
      blockchain.addBlock({ data: "new Block transaction 1" });
      blockchain.addBlock({ data: "new Block transaction 2" });
      blockchain.chain[2].data = "temper hash";

      assert.equal(Blockchain.isValidChain(blockchain.chain), false);
      done();
    });
  });
  describe("chain have block with valid field", async function () {
    it("return true", function (done) {
      blockchain = new Blockchain();
      blockchain.addBlock({ data: "new Block transaction 1" });
      let lastBlock = blockchain.chain[blockchain.chain.length - 1];
      let lastHash = lastBlock.hash;
      let timeStamp = getTimeStamp();
      let nonce = 0;
      let data = [];
      let difficulty = lastBlock.difficulty - 3;
      let hash = generateHash(timeStamp, lastHash, data, nonce, difficulty);
      let block = new Block({
        timeStamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
      });
      blockchain.chain.push(block);

      assert.equal(Blockchain.isValidChain(blockchain.chain), false);
      done();
    });
  });
  describe("chain have block with valid field", async function () {
    it("return true", function (done) {
      let genesisBlock;
      let blockchain;
      genesisBlock = Block.genesis();
      console.log("genesisBlock", genesisBlock);
      blockchain = new Blockchain();
      console.log("blockchain", blockchain.chain[0]);

      blockchain.addBlock({ data: "new Block transaction 1" });
      // console.log(blockchain.chain);
      assert.equal(Blockchain.isValidChain(blockchain.chain), true);
      done();
    });
  });
});

describe("replace chain", async function () {
  let blockchain;
  let newblockchain;
  let originalChain;

  before(async () => {
    blockchain = new Blockchain();
    newblockchain = new Blockchain();
    blockchain.addBlock({ data: "new Block transaction 1" });
    blockchain.addBlock({ data: "new Block transaction 2" });

    originalChain = blockchain.chain;
    // console.log(block);
  });
  describe("when the new chain is not longer", async function () {
    it("does not replace the chain", async function (done) {
      newblockchain.chain = [{ new: "chain" }];
      blockchain.replaceChain(newblockchain.chain);
      expect(blockchain.chain).to.deep.equalInAnyOrder(originalChain);
      done();
    });
  });
  describe("when the new  chain is longer", async function () {
    beforeEach(() => {
      newblockchain = new Blockchain();
      newblockchain.addBlock({ data: "Bears" });
      newblockchain.addBlock({ data: "Beets" });
      newblockchain.addBlock({ data: "Beets" });
    });
    describe("and the chain is invalid", async function () {
      beforeEach(() => {});

      it("does not replace the chain", async (done) => {
        newblockchain.chain[2].hash = "some-fake-hash";
        blockchain.replaceChain(newblockchain.chain);

        expect(blockchain.chain).to.deep.equalInAnyOrder(originalChain);
        done();
      });

      // it('logs an error', () => {
      //   expect(errorMock).toHaveBeenCalled();
      // });
    });
    describe("and the chain is valid ", async function () {
      it("replace the chain ", function (done) {
        blockchain.replaceChain(newblockchain.chain);
        expect(blockchain.chain).to.deep.equalInAnyOrder(newblockchain.chain);
        done();
      });
    });
  });
});
