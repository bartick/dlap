import { configDotenv } from "dotenv";
import { Dialect, Sequelize } from "sequelize";

configDotenv();

let TOKEN: string;
let BOT_ID: string;
let DB_USER: string;
let DB_NAME: string;
let DB_PASS: string;
let DB_HOST: string;
let DB_PORT: number;
let DB_DIALECT: Dialect;

// Check if token is defined
if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not defined");
}
TOKEN = process.env.BOT_TOKEN;

// Giving Bot ID is optional
BOT_ID = process.env.BOT_ID || "";

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
    TOKEN,
    BOT_ID,
    DB_USER,
    DB_NAME,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_DIALECT
}