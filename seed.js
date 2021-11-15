const faker = require('faker/locale/en');
const mongo = require('./mongo.js');

const generateNamespace = () => {
  const namespaceTitle = faker.company.companyName()
  return {
    icon: faker.image.image(),
    title: namespaceTitle,
    endpoint: `/${faker.helpers.slugify(namespaceTitle).toLowerCase()}`,
    rooms: [...Array(Math.floor(Math.random() * 5) + 1)].map(() => {
      const roomTitle = faker.company.companyName()
      return {
        icon: faker.image.image(),
        title: roomTitle,
        slug: faker.helpers.slugify(roomTitle).toLowerCase(),
        messages: [...Array(Math.floor(Math.random() * 5) + 1)].map(() => ({
          user: faker.internet.userName(),
          content: faker.lorem.sentence(),
        }))
      };
    })
  }
}

(async () => {
  const db = await mongo()
  const collection = db.collection('namespaces');

  console.warn('Seeding namespaces...')

  const documents = [...Array(3)].map(() => generateNamespace())

  await collection.deleteMany({})
  await collection.insertMany(documents)
  const documentsCount = await collection.countDocuments()

  console.info('Finished seeding namespaces...')
  console.log(`Inserted: ${documents.length}`)
  console.log(`Total: ${documentsCount}`)

  process.exit()
})()
