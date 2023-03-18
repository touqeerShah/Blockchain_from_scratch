var EC = require('elliptic').ec;
const { generateHash } = require("./generateHash")

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

function verifySignature({ publicKey, data, signature }) {
    var key = ec.keyFromPublic(publicKey, 'hex');
    console.log(key.verify(generateHash(data), signature));
    return key.verify(generateHash(data), signature);
}

module.exports = { verifySignature } 