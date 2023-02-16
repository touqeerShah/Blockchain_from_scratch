const {generateHash,getTimeStamp}= require ("./utils")

let GENESIS_DATA;
const getGenesisData= async ()=>{
    const hash =await generateHash('GENESIS_DATA')
     GENESIS_DATA = {
        timeStamp: getTimeStamp(),
        lastHash: '-----',
        hash:hash ,
        data: []
      };
      return GENESIS_DATA;
      
}

getGenesisData();    
module.exports = { GENESIS_DATA,getGenesisData };
