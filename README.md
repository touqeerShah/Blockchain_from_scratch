# Blockchain_from_scratch
This Project we will start build, test and deployed own Blockchain from zero



Testing we used 
`Jest tool`

To install mocha and chai
```
npm install mocha chai --save-dev

```


Real tim messages on network throught publisher and subscribers with channel using Redis

```
https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298

https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/
```

```
brew services start redis

brew services info redis
redis-cli

```

Once, you have Redis, the key command to run is:

// following command will run it in background
$ redis-server --daemonize yes 

If you can run the above, you’re all good!



***

If you've installed redis, but the above command still isn't working, edit/create this file: ~/.bash_profile:

export PATH=$PATH:<path_to_the_installed_redis_directory>/redis-4.0.11/src

Note that you will need to substitute path_to_the_installed_redis_directory with the absolute path to where the redis download was unzipped. For example ~/Downloads, etc.



install npm module redis and create pub/sub class



```
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

    setTimeout(() => testPubSub.publisher.publish(CHANNEL.TEST, 'foo'), 1000);

}
test();
// because  clint creation in asycn so it should wait it finished to shart new
// setTimeout(() => testPubSub.publisher.publish(CHANNEL.TEST, "Block"), 1000);

```



cross-env it module to set environment varibales programatical with depend on OS you are using

- -  To generate Public key and private key we are using `https://www.npmjs.com/package/elliptic`