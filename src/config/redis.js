const { createClient } = require('redis');


const redisclient =createClient({
    username: 'default',
    password: 'DSZxGPNCByhMzByYsOpo0qsV78EPFZyH',
    socket: {
        host: 'redis-11077.crce214.us-east-1-3.ec2.cloud.redislabs.com',
        port: 11077
    }
});

module.exports = redisclient;
