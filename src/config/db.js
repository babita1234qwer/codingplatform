const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
async function main() {
     //console.log("DB URI:", process.env.DB_CONNECT_STRING);

   await  mongoose.connect(process.env.DB);}
 module.exports=main;