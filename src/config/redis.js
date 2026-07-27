const { createClient } = require('redis');


const redisclient = createClient({
    username: 'default',
    password: 'kylgD8TlaYEGcaHG0LWJ69O1quUqJWne',
    socket: {
        host: 'redis-12104.c81.us-east-1-2.ec2.cloud.redislabs.com',
        port: 12104
    }
});


module.exports = redisclient;
