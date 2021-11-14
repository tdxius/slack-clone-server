const faker = require('faker/locale/en');

const { MongoClient } = require('mongodb');
const url = 'mongodb://mongo:mongo@mongo:27017';
const client = new MongoClient(url);
const dbName = 'slack';

(async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('namespaces');

  const namespaceTitle = faker.company.companyName()
  const documents = [...Array(3)].map(() => ({
    icon: "mdi-briefcase",
    title: namespaceTitle,
    endpoint: `/${faker.helpers.slugify(namespaceTitle).toLowerCase()}`,
    rooms: [...Array(Math.floor(Math.random() * 5) + 1)].map(() => {
      const roomTitle = faker.company.companyName()
      return {
        icon: "mdi-briefcase",
        title: roomTitle,
        slug: `/${faker.helpers.slugify(roomTitle).toLowerCase()}`,
        messages: [...Array(Math.floor(Math.random() * 5) + 1)].map(() => ({
          user: faker.internet.userName(),
          content: faker.lorem.sentence(),
        }))
      };
    })
  }))

  await collection.deleteMany({})
  await collection.insertMany(documents)
  const documentsCount = await collection.countDocuments()

  console.log(`Inserted ${documents.length} namespaces`)
  console.log(`Counted ${documentsCount} namespaces in total`)
})()
