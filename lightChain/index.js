import {sha256} from 'crypto-hash';
const generateHash= async (data)=>{
  return sha256(data);
}
class Block {
  constructor(data, hash, lastHash) {
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
  }
}
// const hash =await generateHash("b1")
// const block= new Block("b1",hash,"");


class Blockchain{
  constructor(){
   
  }
  async init(){
    const hash =await generateHash("gensis")
    const gensisBlock= new Block("gensis",hash,"")
    this.chain=[gensisBlock]
  }  

  async addBlock(data){
    
    const lastHash= this.chain[this.chain.length-1].hash 
    const hash =await generateHash(data+lastHash)
    const newBlock= new Block(data,hash,lastHash)
    this.chain.push(newBlock)
    // console.log(data)

  }
  async sendNotification() {
    try {
      console.log("note")
    } catch (err) {
      console.log(err)
    }
  }
}

const bloclchain = new Blockchain();
await bloclchain.init();
await bloclchain.addBlock("b1");
await bloclchain.addBlock("b2")
await bloclchain.addBlock("b3")
await bloclchain.addBlock("b4")     
  
console.log(bloclchain.chain)
