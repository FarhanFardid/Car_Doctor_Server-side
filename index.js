const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors =require('cors');
require('dotenv').config();

// Midleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res) =>{
    res.send("Car Server is running ....")
})

app.listen(port,() =>{
    console.log("Car server is running on port:", port)
})