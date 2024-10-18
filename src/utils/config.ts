import { configDotenv } from "dotenv";

configDotenv();

export const TOKEN = process.env.BOT_TOKEN as string;
export const BOTID = process.env.BOT_ID as string;