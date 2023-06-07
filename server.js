const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3001;

const connectionStringURI = `mongodb://127.0.0.1:27017`;

const client = new MongoClient(connectionStringURI);

let db;

const dbName = 'socialDB';

client.connect()
    .then(() => {
        console.log('Connected successfully to MongoDB');
        db = client.db(dbName);
        
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Mongo connection error: ', err.message)
    });

    app.use(express.json());

    //crete new user
    app.post('/createuser', (req, res) => {
        db.collection('users').insertOne(
            { username: req.body.username, email: req.body.email, thoughts: req.body.thoughts, friends: req.body.friends}
        )
            .then(results => res.json(results))
            .catch(err => {
                if(err) throw err;
            });
    });

    app.post('/createthought', (req, res) => {
        db.collection('thoughts').insertOne(
            { thoughtText: req.body.thoughtText, createdAt: req.body.createdAt, username: req.body.username, reactions: req.body.reactions}
        )
            .then(results => res.json(results))
            .catch(err => {
                if(err) throw err;
            });
    });

    app.get('/users', (req, res) => {
        db.collection('users')
        .find()
        .toArray()
        .then(results => res.json(results))
        .catch(err => {
            if (err) throw err;
        });
    });

    app.get('/thoughts', (req, res) => {
        db.collection('thoughts')
        .find()
        .toArray()
        .then(results => res.json(results))
        .catch(err => {
            if (err) throw err;
        });
    });

    //this should allow updating a user but I can't get this part to work. It does return a JSON but it's not updating anything
    app.put('/updateuser', (req, res) => {
        db.collection('users').updateOne(
            {"user": "Darth Serious"}, {$set: {"user": "Darth Vader"}}
        )
            .then(results => res.json(results))
            .catch(err => {
                if (err) throw err;
            });
    });

    //this works to delete a user if you put ' "id": "<userid>" ' into the request body in JSON format
    app.delete('/deleteuser', (req, res) => {
        const { id } = req.body; // Assuming the ID is provided as "id" in the request body
        db.collection('users').deleteOne(
            { "_id": new ObjectId(id) }
    )
            .then(results => res.json(results))
            .catch(err => {
                if(err) throw err;
            });
    });

    //This will get rid of a thought
    app.delete('/deletethought', (req, res) => {
        const { id } = req.body; // Assuming the ID is provided as "id" in the request body
        db.collection('thoughts').deleteOne(
            { "_id": new ObjectId(id) }
    )
            .then(results => res.json(results))
            .catch(err => {
                if(err) throw err;
            });
    });