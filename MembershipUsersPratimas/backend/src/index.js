require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

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
    const database = client.db('membershipmanagement');
    const collection = database.collection('memberships');

    const memberships = await collection.find().sort('name', request.query.sort?.toLowerCase() === 'dsc' ? -1 : 1).toArray();
    await client.close();
    return response.status(200).json(memberships);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.post('/', async (request, response) => {
  try {
    const { name, price, description } = request.body;
    const errors = [];
    if (typeof name !== 'string') {
      errors.push('name must be a string');
    }
    // if (!['cat', 'dog', 'bunny'].includes(type)) {
    //   errors.push('type must be cat, dog or bunny');
    // }

    if (!Number.isInteger(price) || price < 0 || price > 99) {
      errors.push('price be an integer between 1 and 99');
    }
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }

    await client.connect();
    const database = client.db('membershipmanagement');
    const collection = database.collection('memberships');
    const membership = await collection.insertOne({ name: name.trim(), price, description });
    await client.close();
    return response.status(200).json(membership);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.delete('/:membershipId', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('membershipmanagement');
    const collection = database.collection('memberships');
    const deletedMembership = await collection.deleteOne({ _id: ObjectId(request.params.membershipId) });
    await client.close();
    response.status(200).json(deletedMembership);
  } catch (error) {
    response.status(500).json({ error });
    console.log(`DELETE: ${error}`);
  }
});



// POSTINAM USERIUS

app.post('/users', async (request, response) => {
  try {
    const { name, surname, email, serviceId } = request.body;
    const errors = [];
    if (typeof name !== 'string') {
      errors.push('name must be a string');
    }
    // if (!['cat', 'dog', 'bunny'].includes(type)) {
    //   errors.push('type must be cat, dog or bunny');
    // }

    if (typeof surname !== 'string') {
      errors.push('surname must be a string');
    }
    if (typeof email !== 'string') {
      errors.push('email must be a string');
    }
    if (typeof serviceId !== 'string') {
      errors.push('service_id must be a string');
    }
  
    await client.connect();
    const database = client.db('membershipmanagement');
    const membershipsCollection = database.collection('memberships');
    const membership = await membershipsCollection.findOne({ _id: ObjectId(serviceId) });
 
    console.log("3est");
    await client.close();
    console.log("4est");

    if ( !membership) {
        errors.push('membership ID not found');
    }
    if (errors.length > 0) {
      console.log(errors)
      return response.status(400).json({ errors });
    }
    await client.connect();
    const userscollection = database.collection('users');
    const users = await userscollection.insertOne({ name: name.trim(), surname: surname.trim(), email, service_id: serviceId });
    await client.close();
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

/// getinam userius

app.get('/users', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('membershipmanagement');
    const collection = database.collection('users');
// agregation stages find, sort, susirasti pagal id memberships kolekcijoj name
// stages: match, lookup, sort, project.
    const users = await collection.//find().sort('name', request.query.sort?.// trinam iki cia: toLowerCase() === 'dsc' ? -1 : 1).toArray();
    await client.close();
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json({ error });
  }
});




app.listen(PORT, () => {
  console.log(
    `My app is running and listening to port http://localhost:${PORT}/`,
  );
});

/// app.get('/', async (request, response) => {
///    try {
///      await client.connect();
///      const database = client.db('PetsDB');
///      const collection = database.collection('pets');
///      const pets = await collection.find().toArray();
///      await client.close();
///      return response.status(200).json(pets);
///    } catch (error) {
///      return response.status(500).json({ error });
///    }
///  });
