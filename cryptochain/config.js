const { generateHash, getTimeStamp } = require("./utils")

let GENESIS_DATA;
const getGenesisData = () => {
  const nonce = 0;
  const difficulty = 3;
  const timeStamp = getTimeStamp()
  const hash = generateHash(1, '-----', 'GENESIS_DATA', nonce, difficulty)
  GENESIS_DATA = {
    timeStamp: 1,
    lastHash: '-----',
    hash: hash,
    data: ['GENESIS_DATA'], nonce, difficulty
  };
  return GENESIS_DATA;

}

getGenesisData();
module.exports = { getGenesisData };
