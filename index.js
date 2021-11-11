const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 8000;

// middle ware 

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a21d7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("BuzzxCycles");
        const productsCollection = database.collection("products")

        // getting api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // posting data 

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api');
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        })

        // specific api with id 

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific one', id);
            const query = { _id: ObjectId(id) };
            const order = await productsCollection.findOne(query);
            res.json(order);
        })


    }
    finally {
        // await client.close();
    }

}


run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello BuzzX server')
})

app.listen(port, () => {
    console.log(` listening at ${port}`)
})