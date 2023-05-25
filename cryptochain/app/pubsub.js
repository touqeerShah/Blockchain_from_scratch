const redis = require("redis");
const { Transaction } = require("../classes/transaction");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};
class PubSub {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    this.publisher = redis.createClient();
    this.subscriberClient = redis.createClient();
  }
  async setupConnection() {
    console.log("setupConnection");
    this.publisher.on("error", (err) => console.log("Redis Client Error", err));

    await this.publisher.connect();

    this.subscriber = this.subscriberClient.duplicate();
    await this.subscriber.connect();

    // here we tell on which channel it will going to listen messages.
    await this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message, channel) =>
      this.handleMessage(channel, message)
    );
    await this.subscriber.subscribe(CHANNELS.TRANSACTION, (message, channel) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    console.log(
      `Message received. Channel: ${channel}. Message: ${
        message instanceof Transaction
      }`
    );

    const parsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage,
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        if (
          !this.transactionPool.existingTransaction({
            inputAddress: this.wallet.publicKey,
          })
        ) {
          this.transactionPool.setTransaction(parsedMessage);
        }
        break;
      default:
        return;
    }
  }

  async publish({ channel, message }) {
    // console.log("channel", channel, message);

    // console.log((await this.subscriber.quit()).toString());
    await this.subscriber.unsubscribe(channel, () => {
      console.log("unsubscribe");
    });
    this.publisher.publish(channel, message, async () => {
      await this.subscriber.subscribe(channel);
    });
    // this.publisher.publish(channel, message);
  }

  async broadcastChain() {
    // console.log("broadcastChain");

    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;
