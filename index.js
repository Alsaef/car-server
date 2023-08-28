const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var cors = require('cors')
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("CarService");
    const services = database.collection("services");
    const bookingDB = client.db("CarService");
    const bookings = bookingDB.collection("booking");
    // red data 
    app.get('/services', async (req, res) => {
      const cursor = services.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };
      const result = await services.findOne(query, options)
      res.send(result)

    })

    //  booking
    app.get('/bookings', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      console.log(req.query?.email)
      const cursor = bookings.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post('/bookings', async (req, res) => {
      const booking = req.body
      console.log(booking)
      const result = await bookings.insertOne(booking)
      res.send(result)

    })
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await bookings.deleteOne(query);
      res.send(result)
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


app.get('/', (req, res) => {
  res.send('Server Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})