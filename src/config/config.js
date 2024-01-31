import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

export const options = {
    server: {
        port: PORT
    },
    mongo: {
        user: MONGO_USER,
        pass: MONGO_PASS,
        cluster: MONGO_CLUSTER
    },
    github: {
        id: GITHUB_ID,
        secret: GITHUB_SECRET
    }
}