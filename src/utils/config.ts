import { configDotenv } from "dotenv";

configDotenv();

export const TOKEN = process.env.BOT_TOKEN as string;
export const BOTID = process.env.BOT_ID as string;
export const DB_USER = process.env.DB_USER as string;
export const DB_PASS = process.env.DB_PASS as string;
export const DB_HOST = process.env.DB_HOST as string;