const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const cors =require('cors');
const jwt= require ('jsonwebtoken')
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
    const serviceCollection = client.db("CarDB").collection("services");
    const bookingCollection = client.db("CarDB").collection("bookings");

// jwt
app.post('/jwt', (req,res)=>{
  const user = req.body;
  console.log(user);
  const token = jwt.sign(user, process.env.Access_Token_Secret,{expiresIn: '10h'});
  res.send({token});
})

    // Service api
    app.get('/services',async (req,res)=>{
        const cursor = serviceCollection.find()
        const result = await cursor.toArray()
        res.send(result);
    })

    app.get('/services/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        res.send(result);
    })

    // app.get('/bookings', async (req,res)=>{
    //   const cursor = bookingCollection.find()
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })

    app.get('/bookings', async (req,res)=> {
      let query ={};
      if(req.query?.email){
        query = {email : req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })

app.patch('/bookings/:id', async(req,res)=> {
  const id = req.params.id;
  const booking= req.body;
  const filter={_id: new ObjectId(id)}
console.log(booking);
  const upDoc ={$set:{
      status : booking.status
  }};
  const result = await bookingCollection.updateOne(filter,upDoc)
  res.send(result)
})

app.delete('/bookings/:id', async(req,res)=> {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
})
    app.post('/bookings', async(req,res)=>{
      console.log('Booking Api hitting');
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking)
      res.send(result);
    })





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