const express=require('express');
const app=express();
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./controllers/socket.js'); // 👈 Import it here

const server = http.createServer(app);

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const main=require('./config/db');
const cookieparser=require('cookie-parser');

const authrouter=require('./routes/userauth');
const submitRouter=require('./routes/submit');
const problemrouter=require('./routes/problemcreator');
const redisclient = require('./config/redis');
const aiRouter=require('./routes/aichatting.js');
const videoRouter=require('./routes/videoCreator.js');
const leaderrouter=require('./routes/leaderboard.js');              
const Commentrouter=require('./routes/commentrouter.js');
const cors=require('cors');

const io = new Server(server, {
  cors: {
    origin:[
    'https://lustrous-chimera-ccf5e4.netlify.app',
    'http://localhost:5173'
  ],
    credentials: true
  }
});
socketHandler(io);

app.use(cors({
 origin: [
    'https://lustrous-chimera-ccf5e4.netlify.app',
    'http://localhost:5173'
  ],
    credentials: true 
}))


app.use(express.json());
app.use(cookieparser());
console.log('authrouter', typeof authrouter);
console.log('problemrouter', typeof problemrouter);
console.log('submitRouter', typeof submitRouter);
console.log('aiRouter', typeof aiRouter);
console.log('videoRouter', typeof videoRouter);
app.use('/user',authrouter);
app.use('/problem',problemrouter);
app.use('/submissions',submitRouter);
app.use('/ai',aiRouter);
app.use('/video',videoRouter);
app.use('/comments',Commentrouter);
app.use('/leader',leaderrouter);



const initialiseconnection=async()=>{
      try{
        await Promise.all([main(),redisclient.connect()]);
        console.log("Connected to DB");
       // app.listen(process.env.PORT,()=>{
           // console.log("Server is running on port",process.env.PORT);
       // })
       server.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
      }
        catch(err){
            console.log("Error connecting to DB",err);
        }
}
/*main()
.then(async()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Connected to DB");
    })
})
.catch((err)=>{
    console.log("Error connecting to DB",err);
})*/
initialiseconnection();
