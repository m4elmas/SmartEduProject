const express = require('express');
const app = express();



//ROUTES
app.get("/",(req,res)=>{
    res.send("lol")
})




const port = 3000;
app.listen(port,()=>{
    console.log(`server ${port} portunda başlatıldı...`)
})