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
    const {
      name, surname, email, serviceId,
    } = request.body;
    const errors = [];
    if (typeof name !== 'string') {
      errors.push('name must be a string');
    }
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
    await client.close();
    if (!membership) {
      errors.push('membership ID not found');
    }
    if (errors.length > 0) {
      console.log(errors);
      return response.status(400).json({ errors });
    }
    await client.connect();
    const userscollection = database.collection('users');
    const users = await userscollection.insertOne({
      name: name.trim(), surname: surname.trim(), email, service_id: ObjectId(serviceId),
    });
    await client.close();
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

/// getinam userius
//* ****** get funkcija su membership name paemimu is kitos kolekcijos ir sort by name

app.get('/users/:order(asc|dsc)', async (request, response) => {
  try {
    const { order } = request.params;
    console.log(request.params);
    console.log(order);
    await client.connect();
    const database = client.db('membershipmanagement');
    const collection = database.collection('users');
    const users = await collection.aggregate([
      {
        $match: {},
      },
      {
        $lookup:
        {
          from: 'memberships',
          localField: 'service_id',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $unwind: '$service',
      },
      {
        $project: {
          name: 1, surname: 1, email: 1, membershipName: '$service.name',
        },
      },
      {
        $sort: { name: order === 'dsc' ? -1 : 1 },
      },
    ]).toArray();

    console.log(users);

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
