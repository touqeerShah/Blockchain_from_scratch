
const { v4: uuidv4 } = require('uuid');
const { getTimeStamp } = require("./../utils")
const { verifySignature } = require("./../utils")

class Transaction {
    constructor({ senderWaller, receiver, amount }) { // { } bracket help to send argument in any order with sequence
        this.id = uuidv4();
        this.outputMap = this.createOutputMap({ senderWaller, receiver, amount });
        this.input = this.createInputMap({ senderWaller, outputMap: this.outputMap });

    }
    createOutputMap({ senderWaller, receiver, amount }) {
        const outputMap = {}
        outputMap[receiver] = amount;
        outputMap[senderWaller.publicKey] = senderWaller.balance - amount;
        return outputMap;
    }
    createInputMap({ senderWaller, outputMap }) {
        const input = {}
        input.timestamp = getTimeStamp()
        input.amount = senderWaller.balance;
        input.address = senderWaller.publicKey;
        input.signature = senderWaller.sign(outputMap)
        return input;
    }

    static validateTransactions(transaction) {
        const outputTotalAmount = Object.values(transaction.outputMap).reduce((total, amount) => total + amount)
        console.log("outputTotalAmount", outputTotalAmount);
        if (outputTotalAmount != transaction.input.amount) {
            console.error("Invalid output map")
            return false
        }
        if (!verifySignature({ publicKey: transaction.input.address, data: transaction.outputMap, signature: transaction.input.signature })) {
            console.error("Invalid signature")
            return false;
        }
        return true;
    }

    update({ senderWaller, receiver, amount }) {
        console.log("receiver", receiver);
        if (this.outputMap[senderWaller.publicKey] < amount) {
            console.error("Amount exceeds balance");
            throw new Error('Amount exceeds balance');
        }
        this.outputMap[receiver] ? this.outputMap[receiver] += amount : this.outputMap[receiver] = amount;
        this.outputMap[senderWaller.publicKey] = this.outputMap[senderWaller.publicKey] - amount;
        this.input = this.createInputMap({ senderWaller, outputMap: this.outputMap });
    }
}

module.exports = { Transaction }