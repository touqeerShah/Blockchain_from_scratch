const redis = require("redis");

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class Sub {
    constructor() {
    }
    async setupConnection() {
        this.subscriber = redis.createClient();
        // await this.subscriber.connect();
        console.log("done here");
        this.subscribeToChannels();

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );

    }
    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

}

module.exports = Sub;