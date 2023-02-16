var hash = require('object-hash');
const generateHash= async (data)=>{
    return hash(data);
  }

module.exports= generateHash;