var crypto = require('crypto');

const generateHash = (...inputs) => {
  const hash = crypto.createHash('sha256');

  hash.update(inputs.map(data => JSON.stringify(data)).sort().join(' '));

  return hash.digest('hex');
}

module.exports = generateHash;