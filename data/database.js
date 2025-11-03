import { MongoClient } from 'mongodb';
import 'dotenv/config';

const clusterAddress = process.env.MONGODB_CLUSTER_ADDRESS;

const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;

const uri = `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${clusterAddress}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

console.log('Trying to connect to db...');

for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log('✅ Connected successfully to MongoDB Atlas');
    break;
  } catch (error) {
    console.log(`❌ Attempt ${attempt}: Failed to connect. Retrying in 3s...`);
    if (attempt === 5) {
      console.error('❌ All attempts failed!:', error);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

const database = client.db(dbName);
export default database;
