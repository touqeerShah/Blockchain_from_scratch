const { generateHash, getTimeStamp } = require("./utils")

let GENESIS_DATA;
const getGenesisData = () => {
  const timeStamp=getTimeStamp()
  const hash = generateHash(timeStamp,'-----','GENESIS_DATA')
  GENESIS_DATA = {
    timeStamp: timeStamp,
    lastHash: '-----',
    hash: hash,
    data: ['GENESIS_DATA']
  };
  return GENESIS_DATA;

}

getGenesisData();
module.exports = { getGenesisData };
