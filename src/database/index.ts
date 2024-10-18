// Use mongodb to create a connection

import { MongoClient } from 'mongodb';

import { DB_HOST, DB_PASS, DB_USER } from '../utils/config';

const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority&appName=dlap`;

export const client = new MongoClient(url);

export const dbconnect = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error(error);
    }
}

export const dbclose = async () => {
    try {
        await client.close();
        console.log('Closed the database connection');
    } catch (error) {
        console.error(error);
    }
}