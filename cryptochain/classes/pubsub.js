const redis = require("redis");

const CHANNEL = {
    TEST: "TEST",
};
class PubSub {
    constructor() {
        // it have both pub and sub because soome node will listen message from some channel for update and publish message on channel somethime
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

    }
    async connectPubSub() {
        console.log("here1");
        this.publisher.on('error', err => console.log('Redis Client Error', err));

        // this.publisher.on('error', err => console.log('Redis Client Error', err));
        await this.publisher.connect();

        console.log("here2");
        const subscriber = this.subscriber.duplicate();
        await subscriber.connect();


        // here we tell on which channel it will going to listen messages.
        await subscriber.subscribe('article', (message) => {
            console.log(message); // 'message'
        });
        //           console.log("here4");
        // this.subscriber.on(
        //     'message',
        //     (channel, message) => this.handleMessage(channel, message)
        // );
    }

    handleMessage(channel, message) {
        console.log(`Message received .channel : ${channel} . Message :${message}`);
    }
}


// here we test it working fine by create instance

// const testPubSub = new PubSub();

async function test() {
    const testPubSub = new PubSub();
    console.log("here3");

    await testPubSub.connectPubSub()
    console.log("here5");
    await testPubSub.publisher.publish('article', JSON.stringify({ "article": "etst" }));
    console.log("here6");

    // setTimeout(() => testPubSub.publisher.publish(CHANNEL.TEST, 'foo'), 1000);

}
test();
// because  clint creation in asycn so it should wait it finished to shart new
// setTimeout(() => testPubSub.publisher.publish(CHANNEL.TEST, "Block"), 1000);
