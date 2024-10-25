import { configDotenv } from "dotenv";
import { Dialect, Sequelize } from "sequelize";

configDotenv();

let TOKEN: string;
let CLIENT_ID: string;
let CLIENT_SECRET: string;
let DB_USER: string;
let DB_NAME: string;
let DB_PASS: string;
let DB_HOST: string;
let DB_PORT: number;
let DB_DIALECT: Dialect;
let NODE_ENV: string;

// Check if node environment is defined
if (!process.env.NODE_ENV) {
    NODE_ENV = "development";
} else {
    NODE_ENV = process.env.NODE_ENV;
}

// Check if token is defined
if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not defined");
}
TOKEN = process.env.BOT_TOKEN;

// Check if client id is defined
if (!process.env.CLIENT_ID) {
    throw new Error("BOT_ID is not defined");
}
CLIENT_ID = process.env.CLIENT_ID;

// Check if client secret is defined
if (!process.env.CLIENT_SECRET) {
    throw new Error("CLIENT_SECRET is not defined");
}
CLIENT_SECRET = process.env.CLIENT_SECRET;

// Check if database user is defined
if (!process.env.DB_USER) {
    throw new Error("DB_USER is not defined");
}
DB_USER = process.env.DB_USER;

// Check if database name is defined
if (!process.env.DB_NAME) {
    throw new Error("DB_NAME is not defined");
}
DB_NAME = process.env.DB_NAME;

// Check if database password is defined
if (!process.env.DB_PASS) {
    throw new Error("DB_PASS is not defined");
}
DB_PASS = process.env.DB_PASS;

// Check if database host is defined
if (!process.env.DB_HOST) {
    throw new Error("DB_HOST is not defined");
}
DB_HOST = process.env.DB_HOST;

// Check if database port is defined
if (!process.env.DB_PORT) {
    throw new Error("DB_PORT is not defined");
}
DB_PORT = parseInt(process.env.DB_PORT);
if (isNaN(DB_PORT)) {
    throw new Error("DB_PORT is not a number");
}

// Check if database dialect is defined
if (!process.env.DB_DIALECT) {
    throw new Error("DB_DIALECT is not defined");
}
// check if process.env.DB_DIALECT is a type of Dialect
if (!["mysql", "postgres", "sqlite", "mariadb", "mssql"].includes(process.env.DB_DIALECT)) {
    throw new Error("DB_DIALECT is not a valid dialect");
}
DB_DIALECT = process.env.DB_DIALECT as Dialect;

export {
    NODE_ENV,
    TOKEN,
    CLIENT_SECRET,
    CLIENT_ID,
    DB_USER,
    DB_NAME,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_DIALECT
}