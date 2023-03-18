const redis = require("redis");

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: 'BLOCKCHAIN'
};
class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriberClient = redis.createClient();

    }
    async setupConnection() {
        // console.log("here1");
        this.publisher.on('error', err => console.log('Redis Client Error', err));

        await this.publisher.connect();

        this.subscriber = this.subscriberClient.duplicate();
        await this.subscriber.connect();


        // here we tell on which channel it will going to listen messages.
        await this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message, channel) => this.handleMessage(channel, message));

    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }


    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });

        })
        // this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}



module.exports = PubSub 