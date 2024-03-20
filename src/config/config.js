import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const PERSISTENCE = process.env.PERSISTENCE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const NODE_ENV = process.env.NODE_ENV;
const MAILING_USER = process.env.MAILING_USER;
const MAILING_PASS = process.env.MAILING_PASS;
const MAILING_SERVICE = process.env.MAILING_SERVICE;
const MAILING_SECRET = process.env.MAILING_SECRET;

export const options = {
    server: {
        port: PORT,
        persistence: PERSISTENCE,
        environment: NODE_ENV
    },
    mongo: {
        user: MONGO_USER,
        pass: MONGO_PASS,
        cluster: MONGO_CLUSTER
    },
    jwt: {
        private_key: JWT_PRIVATE_KEY
    },
    github: {
        id: GITHUB_ID,
        secret: GITHUB_SECRET
    },
    gmail: {
        user: MAILING_USER,
        pass: MAILING_PASS,
        service: MAILING_SERVICE,
        secret: MAILING_SECRET
    }
}