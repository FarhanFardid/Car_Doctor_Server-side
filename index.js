const { MongoClient, ServerApiVersion } = require('mongodb');
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




const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.joz6qi9.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,() =>{
    console.log("Car server is running on port:", port)
})