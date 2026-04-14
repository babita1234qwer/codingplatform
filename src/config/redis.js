const { createClient } = require('redis');


const redisclient = createClient({
  username: "default",
  password: "GIcF9Y056h0gEC9qrfADbByIV3QGEb2Y",
  socket: {
    host: "redis-19541.c266.us-east-1-3.ec2.cloud.redislabs.com",
    port: 19541,
  }});

module.exports = redisclient;
