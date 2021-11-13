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
        const ordersCollection = database.collection("orders")
        const reviewsCollection = database.collection("reviews")
        const usersCollection = database.collection("users")

        // getting api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // posting data 

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api');
            const result = await productsCollection.insertOne(product);
            // console.log(result);
            res.json(result);
        });

        // posting orders api 

        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api');
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });

        // getting order api 

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // specific api with id 

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific one', id);
            const query = { _id: ObjectId(id) };
            const order = await productsCollection.findOne(query);
            res.json(order);
        });

        // posting review api 

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('hit the post api');
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result);
        });

        // getting reviews api 

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // posting users 

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('hit the post api');
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });





        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const updatedDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updatedDoc);
            res.json(result);
        });

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            console.log(users);
            res.send(users);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // getting orders api 

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

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