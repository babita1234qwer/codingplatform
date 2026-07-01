const { createClient } = require('redis');


const redisclient = createClient({
    username: 'default',
    password: '2V7x8MU8xVOLhhGv5WhPq9OrkvDED8Le',
    socket: {
        host: 'redis-18358.c9.us-east-1-4.ec2.cloud.redislabs.com',
        port: 18358
    }
});

module.exports = redisclient;
