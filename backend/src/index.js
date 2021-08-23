require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const { USER, PASS, PORT } = process.env;
// destrukturizuojami apatiniai i viena "object destructurisation":
// const PASS = process.env.PASS;
// const PORT = process.env.PORT;
// `${} - skirta paimti kontamaji i stringa
const URI = `mongodb+srv://${USER}:${PASS}@vigi2.jvlh0.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
app.use(cors(), express.json());
const client = new MongoClient(URI);

app.get('/', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('PetsDB');
    const collection = database.collection('pets');
    const pets = await collection.find().toArray();
    await client.close();
    return response.status(200).json(pets);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.post('/', async (request, response) => {
  try {
    const { name, type, age } = request.body;
    const errors = [];
    if (typeof name !== 'string') {
      errors.push('name must be a string');
    }
    if (!['cat', 'dog', 'bunny'].includes(type)) {
      errors.push('type must be cat, dog or bunny');
    }

    if (!Number.isInteger(age) || age < 0 || age > 100) {
      errors.push('age must be an integer between 1 and 99');
    }
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }

    await client.connect();
    const database = client.db('PetsDB');
    const collection = database.collection('pets');
    const pet = await collection.insertOne({name, type, age});
    await client.close();
    return response.status(200).json(pet);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(
    `My app is running and listening to port http://localhost:${PORT}/`,
  );
});
