const { generateHash, getTimeStamp } = require("./utils");

const STARTING_BALANCE = 1000;
const MINE_RATE = 10;
const REWARD_INPUT = {
  address: "Miner -address",
};
MINER_REWARD = 50;
let GENESIS_DATA;
const getGenesisData = () => {
  const nonce = 0;
  const difficulty = 3;
  const timeStamp = getTimeStamp();
  const hash = generateHash(1, "-----", "GENESIS_DATA", nonce, difficulty);
  GENESIS_DATA = {
    timeStamp: 1,
    lastHash: "-----",
    hash: hash,
    data: ["GENESIS_DATA"],
    nonce,
    difficulty,
  };
  return GENESIS_DATA;
};

getGenesisData();
module.exports = {
  getGenesisData,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINER_REWARD,
};
